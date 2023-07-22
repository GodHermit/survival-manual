import { Node } from 'typescript';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import getURL from './getURL';

type Root = import('mdast').Root;

type Options = {
	embeddedMedia: boolean;
	useRelativePath?: boolean;
	pathReplace?: string;
}

export default function embedMedia(options: Options): import('unified').Plugin<[Node, VFile, () => never], Root> {
	return (tree, file, done) => { // Embed images
		let count = 0;
		visit(tree, 'image', (node: any) => { // Count the amount of images
			if (node.url) {
				count++;
			}
		});

		// If there are no images, we can skip the rest
		if (!count) {
			done()
		}

		visit(tree, 'image', (node: any) => {
			// If the settings are set to not embed images and not use relative paths
			if (!options.embeddedMedia && !options.useRelativePath) {
				node.url = getURL(node.url);

				if (--count === 0) {
					done();
				}
			}

			// If the settings are set to use relative paths
			if (options.useRelativePath) {
				// If the URL is relative and the pathReplace option is set			
				if (node.url.startsWith('/') && options.pathReplace) {
					node.url = node.url.replace(
						(node.url as string).split('/').slice(0, -1).join('/') + '/', // Replace path before the filename
						options.pathReplace
					);
				}

				if (--count === 0) {
					done();
				}
			}

			// If the settings are set to embed images
			if (options.embeddedMedia) {
				fetch(getURL(node.url))
					.then(res => res.blob())
					.then(blob => {
						const reader = new FileReader();
						reader.addEventListener('load', (e) => {
							node.url = e.target?.result;
							if (--count === 0) {
								done();
							}
						});
						reader.readAsDataURL(blob);
					});
			}
		});
	};
}