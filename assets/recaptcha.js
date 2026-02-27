const CAPTCHA_SITE_KEY = '6LeMH4IjAAAAAPH27DUo2KjUA0eH4IMXk3ovKR8D'

$(document).ready(()=>{
  let scripts = document.getElementsByTagName('script')
  let encontrado = false
  const SRC_CAPTCHA = 'https://www.google.com/recaptcha/api.js?render='+CAPTCHA_SITE_KEY
  for (let c=0; c < scripts.length; c++){
      if (scripts[c].src == SRC_CAPTCHA){
          encontrado = true;
          break;
      }
  }
  
  if (!encontrado){
      let script = document.createElement('script')
      script.setAttribute('src', SRC_CAPTCHA)
      script.async = true
      document.head.appendChild(script)
      console.log(script)
  }
})

function get_capcha_token(){
  return new Promise((resolve, reject) => {
      grecaptcha.ready(function() {
          try {
              grecaptcha.execute(CAPTCHA_SITE_KEY, {action: 'submit'}).then(function(token) {
                  resolve(token);
              });
          } catch (e){
              console.log(e)
              resolve('')
          }
      });
  })
}