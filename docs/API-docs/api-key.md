In order to use our API you need to be registered on our site. If you don't have an account go to https://slotslaunch.com/register.
For every API query, you will need to provide your token and the Origin host in the headers.
API queries are rate-limited, always cache on your side
We have the right to terminate API accounts without prior notice if we detect misuse of the api or our services
To obtain your token, go to your account API token page and enter your website's full domain (including www) in the host field. 
It's mandatory to use our links in your games. If we detect you use our services to steal game's final url without using our https://slotslaunch.com/iframe/1235 link in your site, you will be banned.
API is rate limited to 2 r/s for premium users and 0.5 r/s for free users
If your API token is "12345abc" and your origin host is "yourdomain.com" API calls need to be set like this:

PHP:

<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://slotslaunch.test/api/games?token=12345abc',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json',
    'Accept: application/json',
    'Origin: yourdomain.com'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
Javascript:

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");
myHeaders.append("Origin", "yourdomain.com");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://slotslaunch.test/api/games?token=12345abc", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
Did this answer your question?



API Endpoints
List of the available API endpoints:
https://slotslaunch.com/api/games

updated_at: string - Date in format yyyy-mm-dd that will return all games updated from that date. Default: "" 

order: string - Possible values: asc|desc . Default: "asc"

order_by: string - Possible values: name|id|updated_at . Default: "name"

page: int - Default: "1"

per_page: int < 150 - Default: "100"

id[]: array - Pass ID or array of IDS just to pull selected games

provider[]: array - A provider ID that will return all games from that provider

type[]: array - A type ID that will return all games of that type

theme[]: array - A theme ID that will return all games with that theme

published: boolean - By default, it retrieves all games, published and unpublished ones

pluck: boolean - If set to true it will return a list of name and Ids


Response:

{
    "data": [
        {
            "id": 19947,
            "name": "Buffalo Riches",
            "slug": "buffalo-riches",
            "description": null,
            "url": "https://slotslaunch.com/iframe/19947",
            "thumb": "https://slotslaunch.nyc3.digitaloceanspaces.com/20125/buffalo-riches.jpg",
            "provider_id": 263,
            "provider": "Nemesis Games Studio",
            "provider_slug": "nemesis-games-studio",
            "type_id": 1,
            "type": "Slots",
            "type_slug": "slots",
             "themes": [
                {
                    "id": 3,
                    "name": "Halloween",
                    "slug": "halloween",
                    "parent_id": null,
                    "created_at": "2023-08-26T23:19:02.000000Z",
                    "updated_at": "2023-08-26T23:19:02.000000Z"
                }
            ],
            "megaways": 0,
            "bonus_buy": 0,
            "progressive": 0,
            "featured": 0,
            "release": "",
            "reels": "",
            "payline": "",
            "rtp": "",
            "volatility": "",
            "currencies": "",
            "languages": "",
            "land_based": "",
            "markets": "",
            "cluster_slot": "",
            "max_exposure": "",
            "min_bet": "",
            "max_bet": "",
            "max_win_per_spin": "",
            "autoplay": "",
            "quickspin": "",
            "tumbling_reels": "",
            "increasing_multipliers": "",
            "orientation": "",
            "restrictions": "CA,DE,ES,IN,MA,NL,TR,US",
            "created_at": "2022-01-01T21:13:28.000000Z",
            "updated_at": "2023-12-30T19:07:37.000000Z",
            "published": 1
        },
        {....}
],
"meta": {
        "current_page": 134,
        "from": 2661,
        "last_page": 871,
        "path": "https://slotslaunch.com/api/games",
        "per_page": 20,
        "to": 2680,
        "total": 17409
    }

Please refer to Directs Embeds docs to learn how to use the game url.



https://slotslaunch.com/api/providers

updated_at: string -Date in format yyyy-mm-dd that will return all games updated from that date. Default: "" 

order: string - Possible values: asc|desc . Default: "asc"

order_by: string - Possible values: name|id|updated_at . Default: "name"

page: int - Default: "1"

per_page: int < 150 - Default: "100"

provider[]: array - A provider ID that will return all games from that provider

pluck: boolean - If set to true it will return a list of name and Ids


Response:

{
    "data": [
        {
            "id": 1,
            "name": "1Spin4Win",
            "slug": "1spin4win",
            "bio": null,
            "markets": [],
            "thumb": "https://cdn.slotslaunch.com/images/providers/1spin4win.png",
            "created_at": null,
            "updated_at": "2022-10-27T16:37:40.000000Z"
        },
        {...}
],
  "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "path": "https://slotslaunch.test/api/providers",
        "per_page": 100,
        "to": 100,
        "total": 410
    }
}
https://slotslaunch.com/api/types

updated_at: string -Date in format yyyy-mm-dd that will return all games updated from that date. Default: "" 

order: string - Possible values: asc|desc . Default: "asc"

order_by: string - Possible values: name|id|updated_at . Default: "name"

page: int - Default: "1"

per_page: int < 150 - Default: "100"

type[]: array - A type ID that will return all games of that type

pluck: boolean - If set to true it will return a list of name and Ids


Response:

{
    "data": [
        {
            "id": 2,
            "name": "Arcade",
            "slug": "arcade",
            "created_at": "2023-04-21T13:03:11.000000Z",
            "updated_at": "2023-04-21T13:03:11.000000Z"
        },
     {...}
],
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "path": "https://slotslaunch.test/api/types",
        "per_page": 100,
        "to": 25,
        "total": 25
    }
} 
https://slotslaunch.com/api/themes

updated_at: string -Date in format yyyy-mm-dd that will return all games updated from that date. Default: "" 

order: string - Possible values: asc|desc . Default: "asc"

order_by: string - Possible values: name|id|updated_at . Default: "name"

page: int - Default: "1"

per_page: int < 150 - Default: "100"

theme[]: array - A type ID that will return all games of that type

pluck: boolean - If set to true it will return a list of name and Ids


Response:

{
    "data": [
        {
            "id": 1,
            "name": "Christmas",
            "slug": "christmas",
            "created_at": "2022-11-30T16:34:12.000000Z",
            "updated_at": "2022-11-30T16:34:12.000000Z"
        },
       {....}
   ],
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "path": "https://slotslaunch.test/api/themes",
        "per_page": 100,
        "to": 2,
        "total": 2
    }
}
