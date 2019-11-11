import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  if(Meteor.isServer) {
    // When Meteor starts, create new collection in Mongo if not exists.
     Meteor.startup(function () {
         Messages = new Meteor.Collection('messages');
     });
 
 // GET /message - returns every message from MongoDB collection.
 
 Router.route('/message',{where: 'server'})
     .get(function(){
         var response = Messages.find().fetch();
         this.response.setHeader('Content-Type','application/json');
         this.response.end(JSON.stringify(response));
     })
 
   // POST /message - {message as post data}
   // Add new message in MongoDB collection.
 
     .post(function(){
         var response;
         if(this.request.body.message === undefined || this.request.body.message === null || this.request.body.message === "") {
             response = {
              "message": "NULL"
             };
         } else {
             Messages.insert({
                 message : this.request.body.message
             });
             response = {
                 "message" : "message is " + this.request.body.message
             }
         }
         this.response.setHeader('Content-Type','application/json');
         this.response.end(JSON.stringify(response));
     });
 
 Router.route('/message/:id',{where: 'server'})
 
     // GET /message/:id - returns specific records
 
     .get(function(){
         var response;
         if(this.params.id !== undefined) {
             var data = Messages.find({_id : this.params.id}).fetch();
             if(data.length > 0) {
                 response = data
             } else {
                 response = {
                     "message" : "Not is ID"
                 }
             }
         }
         this.response.setHeader('Content-Type','application/json');
         this.response.end(JSON.stringify(response));
     })
 
     // PUT /message/:id {message as put data}- update specific records.
 
     .put(function(){
         var response;
         if(this.params.id !== undefined) {
             var data = Messages.find({_id : this.params.id}).fetch();
             if(data.length > 0) {
                 if(Messages.update({_id : data[0]._id},{$set : {message : this.request.body.message}}) === 1) {
                     response = {
                         "message" : "You Update is " + this.request.body.message
                     }
                 } else {
                     response = {
                         "message" : "Message not updated."
                     }
                 }
             } else {
                 response = {
                     "message" : "Record not found."
                 }
             }
         }
         this.response.setHeader('Content-Type','application/json');
         this.response.end(JSON.stringify(response));
     })
 
     // DELETE /message/:id delete specific record.
 
     .delete(function(){
         var response;
         if(this.params.id !== undefined) {
             var data = Messages.find({_id : this.params.id}).fetch();
             if(data.length > 0) {
                 if(Messages.remove(data[0]._id) === 1) {
                     response = {
                         "message" : "Delete !!"
                     }
                 } else {
                     response = {
                         "message" : "Con not deleted."
                     }
                 }
             } else {
                 response = {
                     "message" : "Con not deleted."
                 }
             }
         }
         this.response.setHeader('Content-Type','application/json');
         this.response.end(JSON.stringify(response));
     });
 }
});
