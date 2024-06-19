import axios, { Axios, AxiosResponse } from "axios";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import environment from "../config/environment";

class WaifuDiff {
  static negativePrompt = ", nsfw, nude, text, sensual, deformed, disfigured, poor details, bad anatomy,"
  static additionalPrompt = ", masterpiece, high quality,"

  updatePrompts(negative: string, additional: string){
    WaifuDiff.negativePrompt += negative;
    WaifuDiff.additionalPrompt += additional;
  }

  public async query(prompt: string, type: string) {
    const filename = `${uuidv4()}.jpg`;
    const filepath = path.resolve(__dirname, '..', 'images', filename);
    let data, pathResult;

    switch(type?.toString()){
      case "object":
        this.updatePrompts(", human, person, people,", "")
        break;
      case "place":
        this.updatePrompts("", ", landscape, wide view,")
        break;
      case "world":
        this.updatePrompts("", ", landscape, wide view,")
        break;
      case "character":
        this.updatePrompts("", "")
        break;
      default:
        //
        break;
    }

    console.log('prompt final:', prompt + WaifuDiff.additionalPrompt);

    if(type?.toString() === 'character'){
      try {
        console.log('trying animagine')
        data = await this.animagine(prompt);
        pathResult = await this.writeImage(data, filename, filepath);
      } catch (err) {
        console.log('not working');
        try {
          console.log('trying AAM XL AnimeMix')
          data = await this.animeMix(prompt);
          pathResult = await this.writeImage(data, filename, filepath);
        } catch (err) {
          console.log('not working');
          try {
            console.log('trying majicMixFantasy')
            data = await this.majicMixFantasy(prompt);
            pathResult = await this.writeImage(data, filename, filepath);
          } catch (err) {
            console.log('not working');
            try {
              console.log('trying animeMix turbo')
              data = await this.animeMixTurbo(prompt);
              pathResult = await this.writeImage(data, filename, filepath);
            } catch (err) {
              console.log('not working');
              try {
                console.log('trying epic photo gasm')
                data = await this.epiCPhotoGasm(prompt);
                pathResult = await this.writeImage(data, filename, filepath);
              } catch (err) {
                console.log('not working');
                try {
                  console.log('trying epic realism');
                  data = await this.epicRealism(prompt);
                  pathResult = await this.writeImage(data, filename, filepath);
                } catch (err) {
                    console.log('not working');
                  try { 
                    console.log('trying majicMixFantasy')
                    data = await this.majicMixFantasy(prompt);
                    pathResult = await this.writeImage(data, filename, filepath);
                  } catch (err) {
                    console.log('not working');
                    try { 
                      console.log('trying absolute reality')
                      data = await this.absoluteReality(prompt);
                      pathResult = await this.writeImage(data, filename, filepath);
                    } catch (err) {
                      console.log('not working');
                      try { 
                        console.log('trying dreamshaper v7')
                        data = await this.dreamshaper_v7(prompt);
                        pathResult = await this.writeImage(data, filename, filepath);
                      } catch (err) {
                        console.log('not working');
                        try { 
                          console.log('trying animagine')
                          data = await this.animagine(prompt);
                          pathResult = await this.writeImage(data, filename, filepath);
                        } catch (err) {
                          console.log('not working');
                          try {
                            console.log('trying AAM XL AnimeMix')
                            data = await this.animeMix(prompt);
                            pathResult = await this.writeImage(data, filename, filepath);
                          } catch (err) {
                            console.log('not working');
                            try {
                              console.log('trying animeMix turbo')
                              data = await this.animeMixTurbo(prompt);
                              pathResult = await this.writeImage(data, filename, filepath);
                            } catch (err) {
                              console.log('not working');
                              try { 
                                console.log('trying local diffusion')
                                data = await this.localDiffusion(prompt);
                                pathResult = await this.writeImageBase64(data, filename, filepath);
                              } catch (err) {
                                console.log('not working');
                                data = await this.waifuDiffusion(prompt);
                                pathResult = await this.writeImage(data, filename, filepath); 
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      if(type?.toString() === 'object'){
        try { 
          console.log('trying AAM XL AnimeMix')
          data = await this.animeMix(prompt);
          pathResult = await this.writeImage(data, filename, filepath);
        } catch (err) {
          console.log('not working');
          try {
            console.log('trying animeMix turbo')
            data = await this.animeMixTurbo(prompt);
            pathResult = await this.writeImage(data, filename, filepath);
          } catch (err) {
            console.log('not working');
            try {
              console.log('trying epic photo gasm')
              data = await this.epiCPhotoGasm(prompt);
              pathResult = await this.writeImage(data, filename, filepath);
            } catch (err) {
              console.log('not working');
              try {
                console.log('trying epic realism');
                data = await this.epicRealism(prompt);
                pathResult = await this.writeImage(data, filename, filepath);
              } catch (err) {
                  console.log('not working');
                try { 
                  console.log('trying majicMixFantasy')
                  data = await this.majicMixFantasy(prompt);
                  pathResult = await this.writeImage(data, filename, filepath);
                } catch (err) {
                  console.log('not working');
                  try { 
                    console.log('trying absolute reality')
                    data = await this.absoluteReality(prompt);
                    pathResult = await this.writeImage(data, filename, filepath);
                  } catch (err) {
                    console.log('not working');
                    try { 
                      console.log('trying dreamshaper v7')
                      data = await this.dreamshaper_v7(prompt);
                      pathResult = await this.writeImage(data, filename, filepath);
                    } catch (err) {
                      console.log('not working');
                      try { 
                        console.log('trying animagine')
                        data = await this.animagine(prompt);
                        pathResult = await this.writeImage(data, filename, filepath);
                      } catch (err) {
                        console.log('not working');
                        try {
                          console.log('trying AAM XL AnimeMix')
                          data = await this.animeMix(prompt);
                          pathResult = await this.writeImage(data, filename, filepath);
                        } catch (err) {
                          console.log('not working');
                          try {
                            console.log('trying animeMix turbo')
                            data = await this.animeMixTurbo(prompt);
                            pathResult = await this.writeImage(data, filename, filepath);
                          } catch (err) {
                            console.log('not working');
                            try { 
                              console.log('trying local diffusion')
                              data = await this.localDiffusion(prompt);
                              pathResult = await this.writeImageBase64(data, filename, filepath);
                            } catch (err) {
                              console.log('not working');
                              data = await this.waifuDiffusion(prompt);
                              pathResult = await this.writeImage(data, filename, filepath); 
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        try {
          console.log('trying epic photo gasm')
          data = await this.epiCPhotoGasm(prompt);
          pathResult = await this.writeImage(data, filename, filepath);
        } catch (err) {
          console.log('not working');
          try {
            console.log('trying epic realism');
            data = await this.epicRealism(prompt);
            pathResult = await this.writeImage(data, filename, filepath);
          } catch (err) {
              console.log('not working');
            try { 
              console.log('trying majicMixFantasy')
              data = await this.majicMixFantasy(prompt);
              pathResult = await this.writeImage(data, filename, filepath);
            } catch (err) {
              console.log('not working');
              try { 
                console.log('trying absolute reality')
                data = await this.absoluteReality(prompt);
                pathResult = await this.writeImage(data, filename, filepath);
              } catch (err) {
                console.log('not working');
                try { 
                  console.log('trying dreamshaper v7')
                  data = await this.dreamshaper_v7(prompt);
                  pathResult = await this.writeImage(data, filename, filepath);
                } catch (err) {
                  console.log('not working');
                  try { 
                    console.log('trying animagine')
                    data = await this.animagine(prompt);
                    pathResult = await this.writeImage(data, filename, filepath);
                  } catch (err) {
                    console.log('not working');
                    try {
                      console.log('trying AAM XL AnimeMix')
                      data = await this.animeMix(prompt);
                      pathResult = await this.writeImage(data, filename, filepath);
                    } catch (err) {
                      console.log('not working');
                      try {
                        console.log('trying animeMix turbo')
                        data = await this.animeMixTurbo(prompt);
                        pathResult = await this.writeImage(data, filename, filepath);
                      } catch (err) {
                        console.log('not working');
                        try { 
                          console.log('trying local diffusion')
                          data = await this.localDiffusion(prompt);
                          pathResult = await this.writeImageBase64(data, filename, filepath);
                        } catch (err) {
                          console.log('not working');
                          data = await this.waifuDiffusion(prompt);
                          pathResult = await this.writeImage(data, filename, filepath); 
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return pathResult;
  }

  private async localDiffusion(prompt: string) : Promise<AxiosResponse<any>> {
    //make a get request to "https://holy-grass-05650.pktriot.net/docs" to check if the model is available
    let request = await axios.get("https://holy-grass-05650.pktriot.net/docs");
    //if the model is available
    if(request.status != 200) new Promise((r, reject) => { reject(); });

    const url = "https://holy-grass-05650.pktriot.net/sdapi/v1/txt2img";

    let body = {
      "prompt": prompt + WaifuDiff.additionalPrompt,
      "negative_prompt": WaifuDiff.negativePrompt,
      "sampler_name": "DPM++ 2S a Karras",
    } 

    let response = await axios.post(url, body);

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async epicRealism(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;

    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/emilianJR/epiCRealism",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt
      }
      
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async epiCPhotoGasm(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;

    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/Yntec/epiCPhotoGasm",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt }
      
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async animeMix(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;

    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/Lykon/AAM_XL_AnimeMix",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt }
      
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async animeMixTurbo(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;

    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/Lykon/AAM_XL_AnimeMix_Turbo",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt }
      
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async majicMixFantasy(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;

    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/digiplay/majicMIXfantasy_v2",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt }
      
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async animagine(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;
    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.0",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt }
      
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async absoluteReality(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;;

    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/digiplay/AbsoluteReality_v1.8.1",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt }
      
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async dreamshaper_v7(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;;

    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/SimianLuo/LCM_Dreamshaper_v7",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/", {
      inputs: completePrompt,
      parameters: {
      num_inference_steps: 4,
      guidance_scale: 8.0,
      lcm_origin_steps: 50,
      negative_prompt: WaifuDiff.negativePrompt }
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async waifuDiffusion(prompt: string) : Promise<AxiosResponse<any>> {
    const completePrompt = prompt + WaifuDiff.additionalPrompt;;
    const api = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/runwayml/",
      headers: {
        Authorization: `Bearer ${environment.HUGGING_FACE_API_TOKEN}`
      }
    });

    let response = await api.post("/stable-diffusion-v1-5", {
      inputs: completePrompt,
      parameters: {
        negative_prompt: WaifuDiff.negativePrompt }
    }, { responseType: 'stream' });

    if (response.status != 200) new Promise((r, reject) => { reject(); });

    return response;
  }

  private async writeImage(response: AxiosResponse<any>, filename: string, filepath : string) : Promise<string> {
    console.log('saving image')
    try {
      const directory = path.dirname(filepath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    }
    catch(error) {
      console.error('Error in writeImage function:', error);
      throw error;
    }
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve('images/' + filename));
      writer.on('error', () => reject());
    });
  }

  private async writeImageBase64(response: AxiosResponse<any>, filename: string, filepath : string) : Promise<string> {
    const buffer = Buffer.from(response.data.images[0], "base64");
    fs.writeFileSync(filepath, buffer);
    
    return new Promise((resolve, reject) => {
      resolve('images/' + filename);
    });
  }
}

const waifuDiff = new WaifuDiff();
export default waifuDiff;
