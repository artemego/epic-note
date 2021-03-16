import { React, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import userSchema from "../schemas/userSchema";

import {
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(userSchema),
  });

  const handleRegister = (data) => {
    console.log(data);
  };

  return (
    <>
      <form>
        <Stack maxWidth={1200} margin="auto" spacing={5} marginTop={5}>
          <FormControl
            isInvalid={!!errors?.email?.message}
            errortext={errors?.email?.message}
          >
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              aria-describedby="email-helper-text"
              ref={register}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            <FormHelperText id="email-helper-text">Your email</FormHelperText>
          </FormControl>
          <FormControl
            isInvalid={!!errors?.password?.message}
            errortext={errors?.password?.message}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                aria-describedby="password-helper-text"
                autoComplete="off"
                ref={register}
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  mr="1rem"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            <FormHelperText id="password-helper-text">
              Your password
            </FormHelperText>
          </FormControl>
          <FormControl
            isInvalid={!!errors?.confirmPassword}
            errortext={errors?.confirmPassword && "Passwords should match"}
          >
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              aria-describedby="confirmPassword-helper-text"
              ref={register}
            />
            <FormErrorMessage>
              {errors.confirmPassword && "Passwords should match"}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            onClick={handleSubmit(handleRegister)}
            colorScheme="green"
            disabled={
              !!errors.email || !!errors.password || errors.confirmPassword
            }
          >
            Register
          </Button>
        </Stack>
      </form>
    </>
  );
}
