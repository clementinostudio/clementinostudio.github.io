"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[810],{30810:(e,t,r)=>{r.d(t,{USDZExporter:()=>n});var a=r(38304),o=r(25263);class n{constructor(){this.textureUtils=null}setTextureUtils(e){this.textureUtils=e}parse(e,t,r,a){this.parseAsync(e,a).then(t).catch(r)}async parseAsync(e,t={}){t=Object.assign({ar:{anchoring:{type:"plane"},planeAnchoring:{alignment:"horizontal"}},includeAnchoringProperties:!0,quickLookCompatible:!1,maxTextureSize:1024},t);let r={},n="model.usda";r[n]=null;let l=i();l+=function(e){let t=!0===e.includeAnchoringProperties?`
		token preliminary:anchoring:type = "${e.ar.anchoring.type}"
		token preliminary:planeAnchoring:alignment = "${e.ar.planeAnchoring.alignment}"
	`:"";return`def Xform "Root"
{
	def Scope "Scenes" (
		kind = "sceneLibrary"
	)
	{
		def Xform "Scene" (
			customData = {
				bool preliminary_collidesWithEnvironment = 0
				string sceneName = "Scene"
			}
			sceneName = "Scene"
		)
		{${t}
`}(t);let f={},m={};for(let d in e.traverseVisible(e=>{if(e.isMesh){let a=e.geometry,n=e.material;if(n.isMeshStandardMaterial){let p="geometries/Geometry_"+a.id+".usda";if(!(p in r)){var t;let e,n=function(e){let t=function(e){var t;let r=e.attributes,a=r.position.count;return`
	def Mesh "Geometry"
	{
		int[] faceVertexCounts = [${Array((null!==(t=e).index?t.index.count:t.attributes.position.count)/3).fill(3).join(", ")}]
		int[] faceVertexIndices = [${function(e){let t=e.index,r=[];if(null!==t)for(let e=0;e<t.count;e++)r.push(t.getX(e));else{let t=e.attributes.position.count;for(let e=0;e<t;e++)r.push(e)}return r.join(", ")}(e)}]
		normal3f[] normals = [${u(r.normal,a)}] (
			interpolation = "vertex"
		)
		point3f[] points = [${u(r.position,a)}]
${function(e){let t="";for(let r=0;r<4;r++){let a=r>0?r:"",o=e["uv"+a];void 0!==o&&(t+=`
		texCoord2f[] primvars:st${a} = [${function(e){let t=[];for(let r=0;r<e.count;r++){let a=e.getX(r),o=e.getY(r);t.push(`(${a.toPrecision(7)}, ${1-o.toPrecision(7)})`)}return t.join(", ")}(o)}] (
			interpolation = "vertex"
		)`)}let r=e.color;if(void 0!==r){let e=r.count;t+=`
	color3f[] primvars:displayColor = [${u(r,e)}] (
		interpolation = "vertex"
		)`}return t}(r)}
		uniform token subdivisionScheme = "none"
	}
`}(e);return`
def "Geometry"
{
${t}
}
`}(a);r[p]=(t=n,e=i()+t,(0,o.strToU8)(e))}n.uuid in f||(f[n.uuid]=n),l+=function(e,t,r){let a="Object_"+e.id,o=s(e.matrixWorld);return 0>e.matrixWorld.determinant()&&console.warn("THREE.USDZExporter: USDZ does not support negative scales",e),`def Xform "${a}" (
	prepend references = @./geometries/Geometry_${t.id}.usda@</Geometry>
	prepend apiSchemas = ["MaterialBindingAPI"]
)
{
	matrix4d xformOp:transform = ${o}
	uniform token[] xformOpOrder = ["xformOp:transform"]

	rel material:binding = </Materials/Material_${r.id}>
}

`}(e,a,n)}else console.warn("THREE.USDZExporter: Unsupported material type (USDZ only supports MeshStandardMaterial)",e)}else e.isCamera&&(l+=function(e){let t=e.name?e.name:"Camera_"+e.id,r=s(e.matrixWorld);return(0>e.matrixWorld.determinant()&&console.warn("THREE.USDZExporter: USDZ does not support negative scales",e),e.isOrthographicCamera)?`def Camera "${t}"
		{
			matrix4d xformOp:transform = ${r}
			uniform token[] xformOpOrder = ["xformOp:transform"]

			float2 clippingRange = (${e.near.toPrecision(7)}, ${e.far.toPrecision(7)})
			float horizontalAperture = ${((Math.abs(e.left)+Math.abs(e.right))*10).toPrecision(7)}
			float verticalAperture = ${((Math.abs(e.top)+Math.abs(e.bottom))*10).toPrecision(7)}
			token projection = "orthographic"
		}
	
	`:`def Camera "${t}"
		{
			matrix4d xformOp:transform = ${r}
			uniform token[] xformOpOrder = ["xformOp:transform"]

			float2 clippingRange = (${e.near.toPrecision(7)}, ${e.far.toPrecision(7)})
			float focalLength = ${e.getFocalLength().toPrecision(7)}
			float focusDistance = ${e.focus.toPrecision(7)}
			float horizontalAperture = ${e.getFilmWidth().toPrecision(7)}
			token projection = "perspective"
			float verticalAperture = ${e.getFilmHeight().toPrecision(7)}
		}
	
	`}(e))}),l+=`
		}
	}
}

`,l+=function(e,t,r=!1){let o=[];for(let n in e){let i=e[n];o.push(function(e,t,r=!1){let o=[],n=[];function i(o,n,i){var s;let l=o.source.id+"_"+o.flipY;t[l]=o;let u=o.channel>0?"st"+o.channel:"st",p={1e3:"repeat",1001:"clamp",1002:"mirror"},f=o.repeat.clone(),m=o.offset.clone(),d=o.rotation,h=Math.sin(d),$=Math.cos(d);return m.y=1-m.y-f.y,r?(m.x=m.x/f.x,m.y=m.y/f.y,m.x+=h/f.x,m.y+=$-1):(m.x+=h*f.x,m.y+=(1-$)*f.y),`
		def Shader "PrimvarReader_${n}"
		{
			uniform token info:id = "UsdPrimvarReader_float2"
			float2 inputs:fallback = (0.0, 0.0)
			token inputs:varname = "${u}"
			float2 outputs:result
		}

		def Shader "Transform2d_${n}"
		{
			uniform token info:id = "UsdTransform2d"
			token inputs:in.connect = </Materials/Material_${e.id}/PrimvarReader_${n}.outputs:result>
			float inputs:rotation = ${(180/Math.PI*d).toFixed(7)}
			float2 inputs:scale = ${c(f)}
			float2 inputs:translation = ${c(m)}
			float2 outputs:result
		}

		def Shader "Texture_${o.id}_${n}"
		{
			uniform token info:id = "UsdUVTexture"
			asset inputs:file = @textures/Texture_${l}.png@
			float2 inputs:st.connect = </Materials/Material_${e.id}/Transform2d_${n}.outputs:result>
			${void 0!==i?"float4 inputs:scale = "+(s=i,`(${s.r}, ${s.g}, ${s.b}, 1.0)`):""}
			token inputs:sourceColorSpace = "${o.colorSpace===a.jf0?"raw":"sRGB"}"
			token inputs:wrapS = "${p[o.wrapS]}"
			token inputs:wrapT = "${p[o.wrapT]}"
			float outputs:r
			float outputs:g
			float outputs:b
			float3 outputs:rgb
			${e.transparent||e.alphaTest>0?"float outputs:a":""}
		}`}return e.side===a.$EB&&console.warn("THREE.USDZExporter: USDZ does not support double sided materials",e),null!==e.map?(o.push(`			color3f inputs:diffuseColor.connect = </Materials/Material_${e.id}/Texture_${e.map.id}_diffuse.outputs:rgb>`),e.transparent?o.push(`			float inputs:opacity.connect = </Materials/Material_${e.id}/Texture_${e.map.id}_diffuse.outputs:a>`):e.alphaTest>0&&(o.push(`			float inputs:opacity.connect = </Materials/Material_${e.id}/Texture_${e.map.id}_diffuse.outputs:a>`),o.push(`			float inputs:opacityThreshold = ${e.alphaTest}`)),n.push(i(e.map,"diffuse",e.color))):o.push(`			color3f inputs:diffuseColor = ${p(e.color)}`),null!==e.emissiveMap?(o.push(`			color3f inputs:emissiveColor.connect = </Materials/Material_${e.id}/Texture_${e.emissiveMap.id}_emissive.outputs:rgb>`),n.push(i(e.emissiveMap,"emissive",new a.Q1f(e.emissive.r*e.emissiveIntensity,e.emissive.g*e.emissiveIntensity,e.emissive.b*e.emissiveIntensity)))):e.emissive.getHex()>0&&o.push(`			color3f inputs:emissiveColor = ${p(e.emissive)}`),null!==e.normalMap&&(o.push(`			normal3f inputs:normal.connect = </Materials/Material_${e.id}/Texture_${e.normalMap.id}_normal.outputs:rgb>`),n.push(i(e.normalMap,"normal"))),null!==e.aoMap&&(o.push(`			float inputs:occlusion.connect = </Materials/Material_${e.id}/Texture_${e.aoMap.id}_occlusion.outputs:r>`),n.push(i(e.aoMap,"occlusion",new a.Q1f(e.aoMapIntensity,e.aoMapIntensity,e.aoMapIntensity)))),null!==e.roughnessMap?(o.push(`			float inputs:roughness.connect = </Materials/Material_${e.id}/Texture_${e.roughnessMap.id}_roughness.outputs:g>`),n.push(i(e.roughnessMap,"roughness",new a.Q1f(e.roughness,e.roughness,e.roughness)))):o.push(`			float inputs:roughness = ${e.roughness}`),null!==e.metalnessMap?(o.push(`			float inputs:metallic.connect = </Materials/Material_${e.id}/Texture_${e.metalnessMap.id}_metallic.outputs:b>`),n.push(i(e.metalnessMap,"metallic",new a.Q1f(e.metalness,e.metalness,e.metalness)))):o.push(`			float inputs:metallic = ${e.metalness}`),null!==e.alphaMap?(o.push(`			float inputs:opacity.connect = </Materials/Material_${e.id}/Texture_${e.alphaMap.id}_opacity.outputs:r>`),o.push(`			float inputs:opacityThreshold = 0.0001`),n.push(i(e.alphaMap,"opacity"))):o.push(`			float inputs:opacity = ${e.opacity}`),e.isMeshPhysicalMaterial&&(null!==e.clearcoatMap?(o.push(`			float inputs:clearcoat.connect = </Materials/Material_${e.id}/Texture_${e.clearcoatMap.id}_clearcoat.outputs:r>`),n.push(i(e.clearcoatMap,"clearcoat",new a.Q1f(e.clearcoat,e.clearcoat,e.clearcoat)))):o.push(`			float inputs:clearcoat = ${e.clearcoat}`),null!==e.clearcoatRoughnessMap?(o.push(`			float inputs:clearcoatRoughness.connect = </Materials/Material_${e.id}/Texture_${e.clearcoatRoughnessMap.id}_clearcoatRoughness.outputs:g>`),n.push(i(e.clearcoatRoughnessMap,"clearcoatRoughness",new a.Q1f(e.clearcoatRoughness,e.clearcoatRoughness,e.clearcoatRoughness)))):o.push(`			float inputs:clearcoatRoughness = ${e.clearcoatRoughness}`),o.push(`			float inputs:ior = ${e.ior}`)),`
	def Material "Material_${e.id}"
	{
		def Shader "PreviewSurface"
		{
			uniform token info:id = "UsdPreviewSurface"
${o.join("\n")}
			int inputs:useSpecularWorkflow = 0
			token outputs:surface
		}

		token outputs:surface.connect = </Materials/Material_${e.id}/PreviewSurface.outputs:surface>

${n.join("\n")}

	}
`}(i,t,r))}return`def "Materials"
{
${o.join("")}
}

`}(f,m,t.quickLookCompatible),r[n]=(0,o.strToU8)(l),l=null,m){let e=m[d];if(!0===e.isCompressedTexture)if(null===this.textureUtils)throw Error("THREE.USDZExporter: setTextureUtils() must be called to process compressed textures.");else e=await this.textureUtils.decompress(e);let a=function(e,t,r){if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement||"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap){let a=r/Math.max(e.width,e.height),o=document.createElement("canvas");o.width=e.width*Math.min(1,a),o.height=e.height*Math.min(1,a);let n=o.getContext("2d");return!0===t&&(n.translate(0,o.height),n.scale(1,-1)),n.drawImage(e,0,0,o.width,o.height),o}throw Error("THREE.USDZExporter: No valid image data found. Unable to process texture.")}(e.image,e.flipY,t.maxTextureSize),o=await new Promise(e=>a.toBlob(e,"image/png",1));r[`textures/Texture_${d}.png`]=new Uint8Array(await o.arrayBuffer())}let d=0;for(let e in r){let t=r[e],a=63&(d+=34+e.length);if(4!==a){let o=new Uint8Array(64-a);r[e]=[t,{extra:{12345:o}}]}d=t.length}return(0,o.zipSync)(r,{level:0})}}function i(){return`#usda 1.0
(
	customLayerData = {
		string creator = "Three.js USDZExporter"
	}
	defaultPrim = "Root"
	metersPerUnit = 1
	upAxis = "Y"
)

`}function s(e){let t=e.elements;return`( ${l(t,0)}, ${l(t,4)}, ${l(t,8)}, ${l(t,12)} )`}function l(e,t){return`(${e[t+0]}, ${e[t+1]}, ${e[t+2]}, ${e[t+3]})`}function u(e,t){if(void 0===e)return console.warn("USDZExporter: Normals missing."),Array(t).fill("(0, 0, 0)").join(", ");let r=[];for(let t=0;t<e.count;t++){let a=e.getX(t),o=e.getY(t),n=e.getZ(t);r.push(`(${a.toPrecision(7)}, ${o.toPrecision(7)}, ${n.toPrecision(7)})`)}return r.join(", ")}function p(e){return`(${e.r}, ${e.g}, ${e.b})`}function c(e){return`(${e.x}, ${e.y})`}}}]);