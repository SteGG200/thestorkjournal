import sanitize from 'sanitize-html'
import sanitizeHtml from 'sanitize-html'

const config : sanitize.IOptions = {
	allowedTags: ['b', 'i', 'a', 'strong', 'em', 'img'],
	allowedAttributes: {
		'a': ['href']
	}
}

export const sanitizer = (dirtyHtml : string) => {
	const cleanHtml = sanitizeHtml(dirtyHtml, config)
	return cleanHtml
}