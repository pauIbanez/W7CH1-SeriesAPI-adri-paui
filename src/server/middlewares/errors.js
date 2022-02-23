const notFoundError = (req, res) => {
  res.status(404).json({ error: "Resouce not found" });
};

// eslint-disable-next-line no-unused-vars
const generalPete = (err, req, res, next) => {
  res.status(err.code || 500).json({ error: err.message || "general pete" });
};

module.exports = { notFoundError, generalPete };
