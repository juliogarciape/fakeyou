// Import the FakeYou class from the local library

import FakeYou from './lib/fakeyou.js';
import 'dotenv/config';

// Create an instance of FakeYou using credentials from environment variables

const fy = new FakeYou({
	username_or_email: process.env.USER_OR_EMAIL,
	password: process.env.PASSWORD,
});

//! ==== Uncomment and use the following methods as needed ====

// Submit request for text to speech
// await fy.textToSpeech('Your text here', 'Model here');

// Check the status of the text-to-speech
// await fy.textToSpeechStatus('Job Token here');

// Retrieve a list of jobs
// await fy.getJobs();

// Download the resulting text-to-speech file
// await fy.downloadTTS('Path here');

// Submit a request for style transfer
// await fy.styleVideo({style: 'Style here', inputFile: 'File here', seconds: 3000});
