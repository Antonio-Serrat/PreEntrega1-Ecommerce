export function getAuth(req, res, next, admin) {
    allow = false

    if(req.method == 'POST' && admin == true) allow = true
    else if(req.method == 'PUT' && admin == true) allow = true
    else if(req.method == 'GET' && admin == true) allow = true
    else if(req.method == 'DELETE' && admin == true) allow = true

    if(allow) next()
    else res.status(403).send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
}