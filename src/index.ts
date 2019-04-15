import { KaenContext } from "@kaenjs/core";
import { targetPathNoSrc } from "@kaenjs/core/utils";
import { Router } from "@kaenjs/router";
import { existsSync, readFile } from "fs";
function send(target:string) {
	return new Promise(resolve=>{
		readFile(target,{encoding: 'utf-8'}, (err, data)=>{
			resolve(data);
		});
	});
}
export class AngularRouter {
	constructor(private name:string, private router:Router) {
		router.get('/assets/.*', this.assets.bind(this));
		router.get('/.*', this.index.bind(this));
	}
	async assets (ctx:KaenContext) {
		let target;
		target = ctx.url.path.replace('/assets', `apps/${this.name}`);
		if(!existsSync( targetPathNoSrc(target))) {
			target = ctx.url.path.replace('/assets', `apps/${this.name}/assets`);
		}
		ctx.body = await send(target);
	}
	async index(ctx:KaenContext) {
		ctx.body = await send(targetPathNoSrc(`apps/${this.name}/index.html`));
	}
}
