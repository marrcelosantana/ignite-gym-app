import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Center,
  Heading,
  Image,
  Text,
  VStack,
  ScrollView,
  useToast,
} from "native-base";

import BackgroundImg from "@assets/images/background.png";
import LogoSvg from "@assets/icons/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

const signUpSchema = yup.object({
  name: yup
    .string()
    .required("Informe o nome")
    .min(2, "O nome deve ter pelo menos 2 dígitos"),
  email: yup.string().required("Informe o email").email("Email inválido"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 dígitos"),
  password_confirm: yup
    .string()
    .required("Confirme a senha")
    .oneOf([yup.ref("password")], "As senhas estão diferentes"),
});

export function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const navigation = useNavigation();
  const toast = useToast();

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);

      await api.post("/users", { name, email, password });

      await signIn(email, password);
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel criar a conta.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          resizeMode="contain"
          position="absolute"
          alt="Pessoas treinando"
        />

        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={12}
          onPress={() => navigation.goBack()}
        />
      </VStack>
    </ScrollView>
  );
}
