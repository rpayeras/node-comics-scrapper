import fs from 'fs-extra';
import axios from 'axios';
import { getImageSize } from './getImageSize.js';
import { log, time } from './log.js';

const {writeJSON} = fs;

const endTime = time();

const INITIAL_ID_XKCD_COMIC = 2500
const MAX_ID_XKCD_COMICS = 2588

for(let id = INITIAL_ID_XKCD_COMIC; id < MAX_ID_XKCD_COMICS; id++){
  const url = `https://xkcd.com/${id}/info.0.json`
  log(`Fetching ${url}`)
  const {data} = await axios.get(url)

  const {num, news, transcript, img, ...restOfComic} = data;

  const {width, height} = await getImageSize({url: img});
  log(`Got image dimensions ${width}x${height}`)

  const comicToStore = {
    id,
    img,
    width,
    height,
    ...restOfComic
  }
  
  writeJSON(`./comics/${id}.json`, comicToStore, {spaces: 2})
  log(`Wrote comic ${id} to ./comics/${id}.json`)
}

endTime()