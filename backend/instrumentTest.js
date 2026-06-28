const instrument = require("./instrumentation/instrumenter");

const code = `
void gcd()
{
    gcd();
}
`;

const result = instrument(code);

console.log(result);