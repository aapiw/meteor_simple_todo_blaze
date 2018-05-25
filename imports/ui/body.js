import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.html';
import './body.html';


Template.body.onCreated(function bodyOnCreated() {
  // this : Blaze Template object
  console.log("Template.body.onCreated: this ",this);
  // console.log("Template.body.onCreated: new ReactiveDict() ", new ReactiveDict());

  this.state = new ReactiveDict();
  console.log("Template.body.onCreated: this.state ",this.state);
  console.log("Template.body.onCreated: this ",this);
  
  Meteor.subscribe('tasks');
  console.log("Template.body.onCreated: Meteor.subscribe ", Meteor.subscribe);

});

Template.body.helpers({
  tasks() {

    const instance = Template.instance();
    console.log("Template.body.helpers: Template.instance() ", Template.instance());

    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
    console.log(Tasks.find({}));
  },
  incompletedCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  }
});

Template.body.events({
  'submit .new-task' (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target; //get the element
    const text = target.text.value;
    console.log(event);
    console.log(event.target);

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);
    // console.log(Meteor);
    // console.log(Meteor.userId());
    // console.log(Meteor.user());

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input' (event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  }
});