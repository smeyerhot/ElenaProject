// We have opt into handling this on the frontend


const funnyFunction = (req, res, next) => {
    try {
        throw "hello"
    } catch (e) {
        logMyErrors(e);
    } next();
}

const testFun = async (req, res) => {
    return res.send(req.userData);
    // return res.status(200).send({'msg':'This is the secret content. Only logged in users can see that!'});
};

const isLoggedIn = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        'SECRETKEY'
      );
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  }


module.exports = {
    isLoggedIn,
    testFun
}