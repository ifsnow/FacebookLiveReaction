// @flow

import {
  REACTIONS,
} from '~/Constants';

import {
  Util,
} from '~/libs';

const comments = [{
  id: 1,
  name: 'Aiden',
  profileImage: require('~/assets/profiles/66.jpg'),
  message: "Isn't this pretty cool?",
}, {
  id: 2,
  name: 'Dorothy',
  profileImage: require('~/assets/profiles/79.jpg'),
  message: "That's what I'm saying!",
}, {
  id: 3,
  name: 'Charles',
  profileImage: require('~/assets/profiles/21.jpg'),
  message: 'Is this all free? Monthly updates?',
}, {
  id: 4,
  name: 'Jennifer',
  profileImage: require('~/assets/profiles/33.jpg'),
  message: 'What does he want?',
}, {
  id: 5,
  name: 'Kevin',
  profileImage: require('~/assets/profiles/60.jpg'),
  message: 'React Native is more widely used?',
}, {
  id: 6,
  name: 'Olivia',
  profileImage: require('~/assets/profiles/85.jpg'),
  message: "That's the only reason?",
}, {
  id: 7,
  name: 'Eric',
  profileImage: require('~/assets/profiles/32.jpg'),
  message: 'There must be someone to help.',
}, {
  id: 8,
  name: 'Robert',
  profileImage: require('~/assets/profiles/76.jpg'),
  message: 'I think so.',
}, {
  id: 9,
  name: 'Angela',
  profileImage: require('~/assets/profiles/72.jpg'),
  message: 'Is there really a next update?',
}, {
  id: 10,
  name: 'Linda',
  profileImage: require('~/assets/profiles/53.jpg'),
  message: 'Nobody knows that.',
}, {
  id: 11,
  name: 'Thomas',
  profileImage: require('~/assets/profiles/41.jpg'),
  message: 'I hope it happens.',
}, {
  id: 12,
  name: 'Sophia',
  profileImage: require('~/assets/profiles/63.jpg'),
  message: "It's our wish.",
}, {
  id: 13,
  name: 'Jason',
  profileImage: require('~/assets/profiles/73.jpg'),
  message: 'I want to cheer him up.',
}, {
  id: 14,
  name: 'Shreya',
  profileImage: require('~/assets/profiles/9.jpg'),
  message: 'What would be good?',
}, {
  id: 15,
  name: 'Fiona',
  profileImage: require('~/assets/profiles/30.jpg'),
  message: 'Is there anything he wants?',
}];

export function GetNewComment() {
  return comments.shift();
}

export function MakeNewReaction() {
  const reactionKeys = Object.keys(REACTIONS);
  const kind = Util.getRandomInArray(reactionKeys);

  const reaction = {
    kind,
    reactionImage: REACTIONS[kind],
  };

  return reaction;
}
