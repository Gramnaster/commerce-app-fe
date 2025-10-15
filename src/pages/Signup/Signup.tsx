import { Form } from "react-router-dom"
import { FormInput } from "../../components"
import { Navbar } from '../../components'

const Signup = () => {

  const handleSubmit = () => {
  const submitData = new FormData()
  console.log(`Signup.tsx = `, submitData)

  }

  return (
    <div>
          <Navbar />
      <Form>
        <FormInput
          type="email"
          label="Email (required)"
          name="email"
          placeholder="user@email.com"
        />
        <FormInput
          type="password"
          label="Password (required)"
          name="password"
          placeholder="user123456"
        />
        <FormInput
          type="password"
          label="Password Confirmation (required)"
          name="password_confirmation"
          placeholder="user123456"
        />
        <button type="submit" onClick={handleSubmit}> Submit</button>
      </Form>
    </div>
  )
}
export default Signup