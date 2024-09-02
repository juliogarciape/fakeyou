import { randomUUID } from 'node:crypto';
import axios from 'axios';

const API_ENDPOINTS = {
	TTS_URL: 'https://api.fakeyou.com/tts/inference',
	TTS_STATUS: 'https://api.fakeyou.com/tts/job/',
	STORAGE_URL: 'https://storage.googleapis.com/vocodes-public',
	WORKFLOWS_URL: 'https://api.fakeyou.com/v1/workflows/enqueue_vst',
};

class FakeYou {
	#session;

	constructor(credentials) {
		this.#session = this.#login(credentials);
	}

	async #login({ password, username_or_email }) {
		try {
			const res = await axios.post('https://api.fakeyou.com/login', {
				username_or_email,
				password,
			});
			return res.data?.signed_session;
		} catch (error) {
			return null;
		}
	}

	async styleVideo({ style = 'dragonball', inputFile, seconds = 3000 }) {
		try {
			const session = await this.#session;
			const res = await axios.post(
				API_ENDPOINTS['WORKFLOWS_URL'],
				{
					creator_set_visibility: 'private',
					enable_lipsync: false,
					input_file: inputFile,
					negative_prompt: '',
					prompt: '',
					style,
					trim_end_millis: seconds,
					trim_start_millis: 0,
					use_cinematic: true,
					use_face_detailer: true,
					use_strength: 1,
					use_upscaler: false,
					uuid_idempotency_token: randomUUID(),
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Cookie: 'session=' + session,
					},
				}
			);
			return res.data;
		} catch (err) {
			return {
				status: 'error',
				message: 'Invalid response from FakeYou API',
			};
		}
	}

	async downloadTTS(path) {
		if (path === null) {
			console.log('No path provided');
			return;
		}

		console.log(API_ENDPOINTS['STORAGE_URL'] + path);
	}

	async textToSpeechStatus(token) {
		try {
			const session = await this.#session;
			const res = await axios.get(API_ENDPOINTS['TTS_STATUS'] + token, {
				headers: {
					'Content-Type': 'application/json',
					Cookie: 'session=' + session,
				},
			});

			return res.data;
		} catch (error) {
			return {
				status: 'error',
				message: 'Invalid response from FakeYou API',
			};
		}
	}

	async getJobs() {
		try {
			const session = await this.#session;
			const res = await axios.get(
				'https://api.fakeyou.com/v1/jobs/session',
				{
					headers: {
						'Content-Type': 'application/json',
						Cookie: 'session=' + session,
					},
				}
			);
			return res.data;
		} catch (error) {
			return {
				status: 'error',
				message: 'Invalid response from FakeYou API',
			};
		}
	}

	async textToSpeech(
		text = 'This text is a test to hear the result of the FakeYou voice model',
		model
	) {
		try {
			const session = await this.#session;
			const res = await axios.post(
				API_ENDPOINTS['TTS_URL'],
				{
					uuid_idempotency_token: randomUUID(),
					tts_model_token: model,
					inference_text: text,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Cookie: 'session=' + session,
					},
				}
			);

			return res.data;
		} catch (error) {
			return {
				status: 'error',
				message: 'Invalid response from FakeYou API',
			};
		}
	}
}

export default FakeYou;
