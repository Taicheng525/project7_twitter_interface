const express = require('express');
const Twit = require('twit');
const ta = require('time-ago')();

const app = express();
const config = require('./config.js');
const T = new Twit(config);

app.set('view engine', 'pug');

app.use(express.static('public'));

T.get('account/verify_credentials', { skip_status: true })
  .then(function (result) {
      const screenName = result.data.screen_name;
      const nameID = result.data.name;
      const imgHost = result.data.profile_image_url;
      const friendNumber = result.data.friends_count;
      const tweetText = [];
      const retweetNumber =[];
      const likes = [];
      const tweetTime = [];
      T.get('statuses/user_timeline', { screen_name: screenName, count: 5},(err,data,res)=>{

          for(let i=0; i<5; i++){
            tweetText.push(data[i].text);
            retweetNumber.push(data[i].retweet_count);
            likes.push(data[i].favorite_count);
            tweetTime.push(ta.ago(data[i].created_at));
          }
          console.log(tweetText[0]);
          return screenName, nameID, imgHost, friendNumber, tweetText, retweetNumber, likes, tweetTime;

      }).then(()=>{
        const fri_name =[];
        const fri_screenName = [];
        const fri_following = [];
        const fri_img = [];
        T.get('friends/list', { screen_name: screenName, count: 5},(err,data,res)=>{

          for(let i=0; i<5; i++){
            fri_name.push(data.users[i].name);
            fri_screenName.push(data.users[i].screen_name);
            fri_img.push(data.users[i].profile_image_url);
            fri_following.push(data.users[i].following);
          }
          return fri_name, fri_screenName, fri_img, fri_following;

        }).then(()=>{
          const msg_text=[];
          const msg_img=[];
          const msg_time=[];
          T.get('direct_messages', {count: 5}, (err,data,res)=>{

            for(let i=0; i<5; i++){
              msg_text.push(data[i].text);
              msg_img.push(data[i].sender.profile_image_url);
              msg_time.push(ta.ago(data[i].sender.created_at));
            }
            return msg_time, msg_img, msg_text;

          }).then(()=>{
              app.get('/', (req,res)=>{

                res.render('body',{
                  screenName11: screenName,
                  nameID11: nameID,
                  hostimg11: imgHost,
                  friendNumber11: friendNumber,
                  tweetText11: tweetText,
                  retweetNumber11: retweetNumber,
                  likes11: likes,
                  tweetTime11: tweetTime,
                  msg_text11: msg_text,
                  msg_time11: msg_time,
                  msg_img11: msg_img,
                  fri_img11: fri_img,
                  fri_following11: fri_following,
                  fri_screenName11: fri_screenName,
                  fri_name11: fri_name
                }
              );
            });
          });//forth then
        });//thrid then
      });//second then

  });//account check then

app.listen(3001,()=>{
  console.log('the app is running');
});
