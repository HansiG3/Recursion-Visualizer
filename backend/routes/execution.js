const express = require("express");
const router = express.Router();

const execute = require("../executor");

router.post("/", (req, res) => {

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            error: "No code provided"
        });
    }

    try {

        const result = execute(code);

        return res.json({
            success: true,
            tree: result.tree,
            events: result.events,
            output: result.output,
            instrumentedCode: result.instrumentedCode
        });

    }
    catch (err) {

        return res.status(400).json({
            success: false,
            error: err.message
        });

    }

});

module.exports = router;