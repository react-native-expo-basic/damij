import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import useModal from "../hooks/useModal";

import { AuthStateType } from "../types/types";
import { useSelector } from "react-redux";
import TokenService from "../services/TokenSerivce";
import styled from "styled-components/native";
import { borderFolderModalColor } from "../style";
import { SimpleLineIcons } from "@expo/vector-icons";
import { textDisableColor } from "../style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { LoginPayload } from "../types/types";
import { textCountListColor, viewDisableColor } from "../style";

interface authState {
  auth: AuthStateType;
}
interface authType {
  email: string;
  error: string;
  isLogin: boolean;
  nickname: string;
  token: string;
}
export default function Mypage() {
  const { openModal } = useModal();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = useSelector((state: authState) => state.auth);

  const [userInfo, setUserInfo] = useState({
    email: "",
    isLogin: false,
    nickname: "",
  });

  const getToken = async () => {
    const isToken = await TokenService.get();
    console.log(isToken, "현재토큰");
    if (isToken === null) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode<authType>(isToken);
      setUserInfo({
        email: decodedToken.email,
        isLogin: decodedToken.isLogin,
        nickname: decodedToken.nickname,
      });
    }
  };
  useEffect(() => {
    getToken();
  }, [auth]);

  return (
    <View>
      <Section>
        {isLoggedIn ? (
          <LoginContainer>
            <LoginMessage isLogin>
              <UserName>{userInfo.nickname}님, 안녕하세요!</UserName>
            </LoginMessage>
            <BtnContainer
              onPress={() => openModal("editProfile", { folderName: "설정" })}
            >
              <SimpleLineIcons
                name="settings"
                size={24}
                color={textDisableColor}
              />
            </BtnContainer>
          </LoginContainer>
        ) : (
          <LoginContainer>
            <LoginMessage isLogin>
              <LoginMainText>다미제이의 회원으로</LoginMainText>
              <LoginSubText>여러 할인 혜택을 받아보세요</LoginSubText>
            </LoginMessage>
            <LoginBtnContainer>
              <BtnContainer onPress={() => openModal("signIn")}>
                <LoginBtn>로그인</LoginBtn>
              </BtnContainer>
              <BtnContainer onPress={() => openModal("signUp")}>
                <LoginBtn>회원가입</LoginBtn>
              </BtnContainer>
            </LoginBtnContainer>
          </LoginContainer>
        )}
      </Section>
      <Section>
        <TitleSection>
          <TitleContainer>
            <Subtitle>최근 본 상품</Subtitle>
          </TitleContainer>
          <ImageList></ImageList>
        </TitleSection>
        <TitleSection>
          <CategoryTitle>도움말</CategoryTitle>
          <Subtitle>공지사항</Subtitle>
        </TitleSection>
      </Section>
    </View>
  );
}

const Section = styled.View`
  background: white;
  padding: 20px 20px;
  margin-bottom: 10px;
`;

const LoginContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const LoginBtnContainer = styled.View`
  display: flex;
  flex-direction: row;
`;
const LoginMessage = styled.View<{ isLogin: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isLogin ? "column" : "row")};

  justify-content: center;
`;
const UserName = styled.Text`
  font-size: 22px;
`;
const LoginMainText = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;
const LoginSubText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #c8c8c8;
  margin-top: 5px;
`;
const LoginBtn = styled.Text`
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;
const BtnContainer = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${borderFolderModalColor};
  padding: 13px 15px;
  border-radius: 25px;
  margin-left: 10px;
`;
const TitleSection = styled.View``;
const TitleContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const CategoryTitle = styled.Text`
  font-size: 14px;
  color: ${textCountListColor};
  margin-bottom: 10px;
`;
const Subtitle = styled.Text`
  font-size: 20px;
`;
const ImageList = styled.View`
  display: flex;
  flex-direction: row;
  margin: 10px 0 20px;
`;
