import type { RequestHandler } from '@builder.io/qwik-city';
import { fetchFont, html, ImageResponse } from 'og-img';
import { config } from '~/config';

export const onGet: RequestHandler = async ({ cacheControl, send, url }) => {
  // Disable caching
  cacheControl('no-cache');

  // Get data from search params
  const title = url.searchParams.get('title');
  const description = url.searchParams.get('description');
  const path = url.searchParams.get('path');

  // Create icon and font directory URL
  const iconUrl = config.base_url + '/icon-192px.png';
  const fontDirUrl = config.base_url + '/fonts';

  const consolas = {
    name: 'Consolas',
    data: await fetchFont(fontDirUrl + '/Consolas.ttf'),
    style: 'normal',
    weight: 400,
  } as const;

  const consolasBold = {
    name: 'Consolas',
    data: await fetchFont(fontDirUrl + '/Consolas-bold.ttf'),
    style: 'normal',
    weight: 700,
  } as const;

  // If title is available, return image with text
  if (title) {
    send(
      new ImageResponse(
        html`
          <div
            tw="flex h-full w-full flex-col justify-between bg-[#1F1F1F] p-16"
            style="font-family: 'Consolas'"
          >
            <div tw="flex items-center justify-between">
              <div tw="flex items-center">
                <img tw="w-16 h-16" src="${iconUrl}" />
                <div
                  tw="text-4xl font-bold text-[#569CD6] ml-4"
                  style="font-family: 'Consolas'"
                >
                  Sean Perez
                </div>
              </div>
              <div
                tw="max-w-[50%] text-4xl text-[#808080]"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
              >
                seanperez.xyz${path ? `/` + path : ''}
              </div>
            </div>
            <div tw="flex flex-col">
              <h1
                tw="max-w-[80%] text-6xl font-medium leading-normal text-[#4EC9B0]"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
              >
                ${title}
              </h1>
              <p
                tw="text-4xl text-[#CE9178] leading-loose"
                style="${description ? '' : 'display: none'}"
              >
                ${description
            ? description.length > 110
              ? description.slice(0, 110).trimEnd() + '...'
              : description
            : ''}
              </p>
            </div>
          </div>
        `,
        {
          width: 1200,
          height: 630,
          fonts: [consolas, consolasBold],
        }
      )
    );

    // Otherwise, return image just with logo
  } else {
    send(
      new ImageResponse(
        html`
          <div
            tw="flex h-full w-full items-center justify-center bg-[#1F1F1F]"
            style="font-family: 'Consolas'"
          >
            <div tw="flex items-center">
              <img tw="w-36 h-36" src="${iconUrl}" />
              <div tw="text-8xl font-medium text-[#569CD6] ml-10">SeanPerez</div>
            </div>
          </div>
        `,
        {
          width: 1200,
          height: 630,
          fonts: [consolasBold],
        }
      )
    );
  }
};