/**
 * Created by sami on 15/05/16.
 */
function getMultipleTags(tags) {
    var feeds = [];
    for (var i = 0, len = tags.length; i < len; i++) {
        feeds.push(new Instafeed({
            // rest of your options
            get: 'tagged',
            tagName: tags[i],
            clientId: 'b7699de0ea314370aeb5466a86505c85',
            accessToken: '523407829.1677ed0.e4b8167878444ab79936d95eb6112d3e',
            target: 'insta',
            resolution: 'low_resolution',
            limit: 4,
            template: '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 nopadding"><a href="{{link}}" target="_blank"><img src="{{image}}" class="img-responsive" /></a></div>'
        }));
    }
    return feeds;
}
// get multiple tags
myTags = getMultipleTags(eventTagss);

console.log(eventTagss);
// run each instance
for(var i=0, len=myTags.length; i < len; i++) {
    console.log(myTags[i]);
    myTags[i].run();
}