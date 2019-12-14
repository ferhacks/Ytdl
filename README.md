# YTDL-API
A heroku-ready JSON YouTube downloader API.
Used in [taylor](https://n0rmancodes.github.io/taylor/) currently.

## Public Demo 
A demo of the API can be used [here](https://open-ytdl-api.herokuapp.com).

Please host on your own heroku server (a free hosting service) and do not use the public demo in yourself, unless this is only as **LIGHT/MINOR TESTING**.

## Endpoints
### A response for DL links with audio and video:

```http://[whatever.host.you.use]/?url=[youtube.link]```

[Public Demo](http://open-ytdl-api.herokuapp.com/?url=https://www.youtube.com/watch?v=UG_Ks_wRTpo)


### A response for audio only DL links:

```http://[whatever.host.you.use]/?audio=1&url=[youtube.link]```

[Public Demo](http://open-ytdl-api.herokuapp.com/?audio=1&url=https://www.youtube.com/watch?v=UG_Ks_wRTpo)


### A response with all avaliable infomation: 

```http://[whatever.host.you.use]/?info=1&url=[youtube.link]```

[Public Demo](http://open-ytdl-api.herokuapp.com/?info=1&url=https://www.youtube.com/watch?v=UG_Ks_wRTpo)

### A search for a YouTube video

```http://[whatever.host.you.use]/?search=[query]```

[Public Demo](http://open-ytdl-api.herokuapp.com/?search=test)
