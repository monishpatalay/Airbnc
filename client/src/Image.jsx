import { uploadUrl } from './config.js';

export default function Image({src, alt = '', ...rest}) {
    src = src && src.includes('https://')
      ? src
      : uploadUrl(src);
    return (
      <img {...rest} src={src} alt={alt} />
    );
  }
