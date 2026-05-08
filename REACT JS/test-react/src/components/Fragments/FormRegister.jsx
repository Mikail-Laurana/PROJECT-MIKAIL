import Button from "../Elements/Button/button";
import InputForm from "../Elements/input";


const FormRegister = (props) => {
    return(
        <form action="">
          <InputForm
            label="Full Name" 
            name="full name" 
            type="text" 
            placeholder="Masukkan Nama Anda"
          />
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
          <InputForm
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Konfirmasi Password Anda"
          />
          <Button variant="bg-blue-600 w-full">Register</Button>
        </form>
    )
}

export default FormRegister;