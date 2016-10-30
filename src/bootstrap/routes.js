export default function routes (app) {
	app.get('/status', (req, res) => res.status(200).json({ status: 200 }));
}
