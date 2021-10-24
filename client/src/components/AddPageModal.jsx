import {
  Modal,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const modalSchema = yup.object().shape({
  pageTitle: yup.string().required(),
});

// Todo: добавить isLoading state для страниц пользователя. (в дальнейшем скорее всего будет в userContext)

export default function AddPageModal({ isOpen, onClose, onSave, isLoading }) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
    resolver: yupResolver(modalSchema),
  });

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalContent
          position="absolute"
          left="0px"
          bottom="10px"
          width="300px"
        >
          <FormLabel mt="10px" ml="25px">
            New page title
          </FormLabel>
          <ModalBody position="relative">
            <FormControl
              isInvalid={!!errors?.pageTitle?.message}
              errortext={errors?.pageTitle?.message}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Input
                  placeholder="New page"
                  id="pageTitle"
                  name="pageTitle"
                  type="text"
                  ref={register}
                />

                <Button
                  colorScheme="orange"
                  ml={2}
                  type="submit"
                  isLoading={isLoading}
                  onClick={handleSubmit(onSave)}
                  disabled={
                    !!errors.pageTitle ||
                    errors.confirmPassword ||
                    isLoading === true
                  }
                >
                  Save
                </Button>
              </Box>
              <FormErrorMessage>{errors.pageTitle?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
