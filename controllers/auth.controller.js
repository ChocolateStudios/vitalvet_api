export const register = (req, res) => {
    console.log(req.body);
    res.json({ message: 'Hello World!' });
};

export const login = (req, res) => {
    res.json({ message: 'Hello World!' });
};