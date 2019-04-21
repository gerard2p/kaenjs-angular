import { KaenContext, HTTPVerbs } from "@kaenjs/core";
import { targetPathNoSrc } from "@kaenjs/core/utils";
import { Router, RouterModel, ROUTE } from "@kaenjs/router";
import { existsSync, readFile, statSync, createReadStream } from "fs";
import { MimeType } from "@kaenjs/core/mime-types";
import { extname } from "path";
function send(target:string) {
	return createReadStream(target);
}
export class AngularModel extends RouterModel {
	name:string = 'angular-app'
	path:string = 'public'
	@ROUTE(HTTPVerbs.get, '/.*') async index(ctx:KaenContext) {
		let file = targetPathNoSrc(this.path, this.name, ctx.url.path);
		if(existsSync(file) && statSync(file).isFile()) {
			ctx.body = await send(file);
			ctx.type = MimeType[extname(file)]
		} else {
			ctx.body = await send(targetPathNoSrc(`${this.path}/${this.name}/index.html`));
			ctx.type = MimeType[".html"];
		}
	}
	@ROUTE(HTTPVerbs.get, '/assets/.*') async assets (ctx:KaenContext) {
		let file = targetPathNoSrc(this.path, this.name, ctx.url.path);
		if(!existsSync(  file)) {
			file = ctx.url.path.replace('/assets', `${this.path}/${this.name}/assets`);
		}
		ctx.body = await send(file);
		ctx.type = MimeType[extname(file)]
	}
}
