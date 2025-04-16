"use strict";

const { writeFile } = require("node:fs/promises");
const { existsSync } = require("fs");
const fs = require("fs");
const fsa = require("fs").promises;
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const API_URL = "https://api-key.fusionbrain.ai/";
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const authHeaders = {
	"X-Key": `Key ${API_KEY}`,
	"X-Secret": `Secret ${SECRET_KEY}`,
};

async function getPipeline() {
	const response = await axios.get(`${API_URL}key/api/v1/pipelines`, {
		headers: authHeaders,
	});
	return response.data[0].id;
}

async function generateImage(prompt, pipelineId, width = 1024, height = 1024) {
	const form = new FormData();
	const params = {
		type: "GENERATE",
		numImages: 1,
		width,
		height,
		generateParams: {
			query: prompt,
		},
	};

	form.append("pipeline_id", pipelineId);
	form.append("params", JSON.stringify(params), {
		contentType: "application/json",
	});

	const response = await axios.post(
		`${API_URL}key/api/v1/pipeline/run`,
		form,
		{
			headers: {
				...form.getHeaders(),
				...authHeaders,
			},
		}
	);

	return response.data.uuid;
}

async function checkGeneration(uuid) {
	const response = await axios.get(
		`${API_URL}key/api/v1/pipeline/status/${uuid}`,
		{ headers: authHeaders }
	);
	return response.data;
}

module.exports = {
	name: "fusionbrain",

	actions: {
		generate: {
			params: {
				prompt: "string",
			},
			async handler(ctx) {
				try {
					const { prompt, width, height } = ctx.params;
					const pipelineId = await getPipeline();
					const uuid = await generateImage(
						prompt,
						pipelineId,
						width,
						height
					);

					return { uuid, status: "PROCESSING" };
				} catch (error) {
					console.error("Generation error:", error);
					return { status: "FAILED" };
				}
			},
		},

		check: {
			params: {
				uuid: "string",
			},
			async handler(ctx) {
				const { uuid } = ctx.params;
				const imageFile = `public/images/${uuid}.jpg`;
				const imageUrl = `${process.env.IMAGES_HOST}/images/${uuid}.jpg`;

				this.clearImages();

				if (existsSync(imageFile)) {
					return { uuid, image: imageUrl, status: "DONE" };
				}

				try {
					const task = await checkGeneration(uuid);

					if (task.status === "DONE") {
						const imgData = task.result.files[0];
						const imgBuffer = Buffer.from(imgData, "base64");
						await writeFile(imageFile, imgBuffer);
						return { uuid, image: imageUrl, status: "DONE" };
					}

					return { ...task, uuid };
				} catch (error) {
					console.error("Check error:", error);
					return { uuid, status: "FAILED" };
				}
			},
		},
	},

	methods: {
		clearImages() {
			const folderPath = "public/images";
			const PERIOD_IN_MS = 20 * 60 * 1000;
			const now = Date.now();

			fs.readdir(folderPath, (err, files) => {
				if (err) return;

				files.forEach((file) => {
					const filePath = path.join(folderPath, file);

					fs.stat(filePath, async (err, stats) => {
						if (err || !stats.isFile()) return;

						const fileAge = now - stats.mtimeMs;
						if (fileAge > PERIOD_IN_MS) {
							await fsa.unlink(filePath).catch(() => {});
						}
					});
				});
			});
		},
	},
};
