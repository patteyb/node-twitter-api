<p>Many existing services like Twitter, Facebook, Google Maps, Paypal, and Github allow you to leverage their code in your own applications by talking to their APIs. Using Node to connect to 3rd party APIs provides much greater control than using just AJAX. Server-side communication with APIs offers many more options and greater access to data, but it also require stricter authentication methods. </p>

<p>In this project, you'll use Twitter’s REST API to access your Twitter profile information and render it to a user. The page should automatically authenticate access to your Twitter profile. It should use this access to populate three columns on your page:</p>

<p>Your 5 most recent tweets.
Your 5 most recent friends.
Your 5 most recent private messages.</p>

<p>The ability to look at a layout and see the data behind it is an essential skill for full-stack developers. With the provided HTML and CSS starter files, you'll be able to see what the final result should look like. Replace the example data from the HTML file, with your own information which you'll grab directly from Twitter's API. </p>

There are nine steps to complete this project:

<h4>1. Create a Twitter app through <a href="https://apps.twitter.com/">Twitter’s developer portal</a>  and get the needed API keys. Every service has a slightly different way of handling API keys and authentication. Check the project resources for some guides on getting your keys from Twitter.</h4>
        
<h4>2. Authenticate your application instance from your server code. It’s a good idea to use an npm module to help you with this part. The project resources link to Twitter’s recommended service: TwitterJSClient. This is NOT the only way, so feel free to explore others. Your solution must somehow require your API key and other relevant information from Twitter.</h4>
        
<h4>3. Make a template using Jade, Handlebars, or another JavaScript template engine for the main page. The template should have spaces for:</h4>

<p>*your 5 most recent tweets<br>
*your 5 most recent friends<br>
*your 5 most recent private messages  </p>

<p>It should also include your personal Twitter name and profile image at the top of the screen.</p>

<p>Styling is not the important part of this project. Craft your template markup to take advantage of the CSS we’ve provided you. Knowing how to work with someone else’s styles is a very important skill as a full-stack developer. Pay attention to class names, inheritance, and so on. Try to avoid element types that are not used in the provided HTML and CSS files.</p>
        
<h4>4. Each rendered result must include all of the information seen in the sample layout</h4>

<p>*tweets<br>
  -message content<br>
  -# of retweets<br>
  -# of likes<br>
  -date tweeted<br>
*friends<br>
  -profile image<br>
  -real name<br>
  -screenname<br>
*messages<br>
  -message body<br>
  -date the message was sent<br>
  -time the message was sent  </p>
        
<h4>5. Using Node and Express, request the data you need from Twitter’s API, render it in your template, and send it to the client. You’ll need to set up at least one Express route to manage this process. Please set up your project without the use Express generator.</h4>
        
<h4>6. Make sure the application actually renders your correct Twitter information by running it on your local machine, and comparing it to your recent Twitter activity.</h4>
        
<h4>7. <u>It is very important that you do NOT upload any of your personal API keys / secrets / passwords to Github or other publicly accessible place</u>. You should remove them from your application BEFORE you push to Github or submit. See project resources for links about how to deploy your application live with your keys safely.</h4>

<p>We will use our own application keys to test your code during code review.</p>
        
<h4>8. Put your project in a new GitHub repository on your GitHub account:</h4>


<h4>9. You should also check for issues with your JavaScript code using JSHint, linked in the Project Resources.</h4>

<p>*JSHint may show you some warnings, so make sure to check through those for any potential problems.<br>
*You do not need to fix every warning listed but reviewing them can be useful.    </p>

<hr>


<h2>Extra Credit</h2>
<p>To get an "exceeds" rating, you can expand on the project in the following ways:</p>
            

<h4>1. Add a section to the bottom of your page that allows a user to post a new tweet.</h4>

<h4>2. If you add a post tweet feature, show new tweets on the page without refreshing.</h4>

<h4>3. Add an error page to your application, so that if anything goes wrong with your routes the user will see a friendly message rendered, instead of the default error code.</h4>

 <h4>4. Include your personal background image from Twitter as a background for the page header.</h4>