import Button from "../Elements/Button/button";
import InputForm from "../Elements/input";


const FormLogin = (prop) => {
  const handleLogin = () => {
    event.preventDefault()
    localStorage.setItem('email',event.target.email.value)
    localStorage.setItem('password',event.target.password.value)
    window.location.href = "/product"
  }
    return(
        <form onSubmit={handleLogin}>
          <InputForm
            label="Email" 
            name="email" 
            type="email" 
            placeholder="Masukkan Email Anda"
          />
          <InputForm
            label="Password"
            name="password"
            type="password"
            placeholder="Masukkan Password Anda"
          />
          <Button variant="bg-blue-600 w-full" type="submit">Login</Button>
        </form>
    )
}

export default FormLogin;