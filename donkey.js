(function () {
	console.info('Wait for 2logs from firebase scripts to output and you can exec << useDonkey >>')

	const firebaseAppJS = document.createElement("script")
	const firebaseDatabaseJS = document.createElement("script")
	const IMG_URL_BASE = 'http://s0urce.io/client/img/word/'

	firebaseAppJS.type = 'text/javascript'
	firebaseAppJS.src = 'https://www.gstatic.com/firebasejs/5.9.3/firebase-app.js'
	firebaseDatabaseJS.type = 'text/javascript'
	firebaseDatabaseJS.src = 'https://www.gstatic.com/firebasejs/5.9.3/firebase-database.js'

	document.body.appendChild(firebaseAppJS)
	document.body.appendChild(firebaseDatabaseJS)

	firebaseDatabaseJS.onload = function (e) {
		console.log('Firebase database script loaded')
	}
	firebaseAppJS.onload = function (e) {
		console.log('Firebase app script loaded')
	}

	const config = {
	  apiKey: "AIzaSyBMv55VC0zntbde9hJg7wIIEQbp9McpJTw",
	  authDomain: "s0urce-io-store.firebaseapp.com",
	  databaseURL: "https://s0urce-io-store.firebaseio.com",
	  projectId: "s0urce-io-store",
	  storageBucket: "",
	  messagingSenderId: "826378691577"
	}

	window.writeWord = function (url, word) {
		if (url && word) firebase.database().ref(url).set(word)
	}

	window.readWord = function (url) {
		const formattedURL = url.split(IMG_URL_BASE)[1]

		return new Promise(function (resolve) {
			firebase.database().ref(formattedURL).once('value').then(function (snapshot) {
		  	if (snapshot.exists()) {
		  		resolve(snapshot.val())
		  	} else resolve(false)
			})
		})
	}

	window.donkey = function () {
		const store = {}

		const input = document.getElementById('tool-type-word')
		const wordImg = document.querySelector('img.tool-type-img')
		const KEYCODE_ENTER = 13

		let currentWord = ''
		let currentImgSrc = ''

		const userSubmitted = function (e) {
			if (currentImgSrc) {
				store[currentImgSrc] = currentWord

				window.writeWord(currentImgSrc, currentWord)

				currentWord = ''
				currentImgSrc = ''
			}
		}

		const onKeyUp = function (e) {
			if (e.keyCode === KEYCODE_ENTER) {
				userSubmitted(e)
			} else {
				currentWord = input.value
				currentImgSrc = wordImg.src.split(IMG_URL_BASE)[1]
			}
		}

		const onImageChangeFn = function (e) {
			setTimeout(function () {
				if (wordImg.src) {
					if (store.hasOwnProperty(wordImg.src)) {
						input.value = store[wordImg.src]
						currentWord = store[wordImg.src]
					} else {
						window.readWord(wordImg.src).then(function (word) {
							if (word && typeof word === "string") {
								input.value = word
								currentWord = word
							}
						})
					}
				}
			}, 50)
		}

		input.onkeyup = onKeyUp
		wordImg.onload = onImageChangeFn
	}

	window.useDonkey = function () {
		firebase.initializeApp(config)
		window.database = firebase.database()
		window.donkey()
	}
}) ()
