export default async function send(req, res) {
    const { pid } = req.query
    res.redirect('/product-add-ondiscount?pid='+pid)
}