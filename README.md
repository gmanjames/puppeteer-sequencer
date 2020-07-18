# WIP - puppeteer-sequencer
A library for defining actions over DOM-elements in sequence using a simple DSL

## Examples

**DSL**
```
form#login
    input[name="username"]:type:username
    input[name="password"]:type:password
.welcomeLoginButton:click
```

**Output**
```
html$form#login input[name="username"] -- type "username"
html$form#login input[name="password"] -- type "password"
html$.welcomeLoginButton -- click
sequence completed
```

**Test**
```
# run
npm run test
```
