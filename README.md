## Folder structure
```json
/
|__asset/             // asset files of this website
|  |__css
|  |__js
|  |__img             // uploaded images from local will be saved here
|
|__content/           //data of website, view and edit by Admin 
|  |__metadata/
|  |  |__ global.json   
|  |__index.md
|  |__404.md         //be hidden
|
|__layout/            //the layout of websites, view and edit by Devs
|  |__partial/
|  |__404.html
|  |__default.category.html
|
|__README.md
|__site.js
```

### License
#### The MIT License (MIT)

Copyright (c) 2015-2017 EasyWeb Ltd,.Co

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


## Thiết lập metalsmith-chaged

- luôn luôn build trang chủ `index.html`
```
 case 'metalsmith-category' :
    ms.use(plugin(options));
    ms.use(changed({
        forcePattern: [
            '**/index.md',  // always build index files
            'index.html'
        ]
        }))
    break;
```
 
```
DEBUG=metalsmith-changed,metalsmith-timer npm run watch

npm run watch
```