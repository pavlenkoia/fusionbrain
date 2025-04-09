"use strict";

const { FusionBrain } = require("fusionbrain-api");
const { writeFile } = require("node:fs/promises");
const { existsSync } = require("fs");
const fs = require("fs");
const fsa = require("fs").promises;
const path = require("path");

const fb = new FusionBrain(process.env.API_KEY, process.env.SECRET_KEY);

module.exports = {
	name: "fusionbrain",

	actions: {
		generate: {
			params: {
				prompt: "string",
			},
			async handler(ctx) {
				const { prompt, width, height } = ctx.params;

				const models = await fb.getModels();
				const styles = await fb.getStyles();

				const kandinsky = models[0].id;
				let style = styles[0].name;

				if (/*await fb.isReady(kandinsky)*/true) {
					let generation = await fb.generate(kandinsky, prompt, {
						style,
						width: width || 768,
						height: height || 768,
					});
					if (generation.accepted === true) {
						let task = generation.task;

						return task;
					}
				}

				return { status: "FAILED" };
			},
		},

		check: {
			params: {
				uuid: "string",
			},
			async handler(ctx) {
				const { uuid } = ctx.params;

				const imageFile = `public/images/${uuid}.jpg`;
				const image = `${process.env.IMAGES_HOST}/images/${uuid}.jpg`;

				this.clearImages();

				if (existsSync(imageFile)) {
					return {
						uuid,
						image,
						status: "DONE",
					};
				} else {
					let task = await fb.checkTask(uuid);

					if (task.isFinished()) {
						if (task.isSuccess()) {
							let imgBuf = Buffer.from(task.images[0], "base64");
							await writeFile(imageFile, imgBuf);
							return {
								uuid,
								image,
								status: "DONE",
							};
						}
					} else {
						return task;
					}
				}
			},
		},
	},

	methods: {
		clearImages() {
			const folderPath = "public/images";
			const PERIOD_IN_MS = 20 * 60 * 1000; // 20 минут

			const now = Date.now();

			fs.readdir(folderPath, (err, files) => {
				if (err) {
					return;
				}

				files.forEach((file) => {
					const filePath = path.join(folderPath, file);

					fs.stat(filePath, async (err, stats) => {
						if (err) {
							return;
						}

						if (stats.isFile()) {
							const fileAge = now - stats.mtimeMs; // Возраст файла в миллисекундах

							if (fileAge > PERIOD_IN_MS) {
								await fsa.unlink(filePath, () => {}); // Удаляем файл, игнорируя ошибки
							}
						}
					});
				});
			});
		},
	},
};
