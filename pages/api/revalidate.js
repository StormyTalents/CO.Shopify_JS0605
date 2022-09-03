export default async function handler(req, res) {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== "donato") {
      return res.status(401).json({ message: 'Invalid token' })
    }
  
    try {
        console.log('[Next.js] Revalidating /');
      await res.unstable_revalidate('/')
      return res.json({ revalidated: true })
    } catch (err) {
        console.log(err)
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send('Error revalidating')
    }
  }