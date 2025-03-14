import styled, { keyframes } from 'styled-components';
import loadingGif from '../../assets/loading.gif';

//キーフレームアニメーション定義
const fadeIn = keyframes`
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
`;

//ローディング画像のスタイル定義
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  /* 半透明の黒背景 */
  display: flex;
  justify-content: center;
  align-items:center;
  z-index: 9999;  /* 最前面に表示 */
  animation: ${fadeIn} 0.3s ease-in-out;  /* フェードインのアニメーション */
`;

//Gifのスタイル
const Gif = styled.img`
  width: 100px;  /* 画像の幅 */
  height: 100px;  /* 画像の幅 */
  @media (max-width: 600px) {
    width: 80px;
    height: 80px;
  }
`;

//オーバーレイ内のコンテナ
const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

//テキストのスタイル
//const LoadingText = styled.p`
//  margin-top: 10px;
//  color: white;
//  font-size: 1.2em;
//`;

const LoadingOverlay = () => {
  return (
    <Overlay role="alert" aria-live="assertive">
      <SpinnerContainer>
        <Gif src={loadingGif} alt="loading" />
        {/* <LoadingText>Now Loading...</LoadingText> */}
      </SpinnerContainer>
    </Overlay>
  );
}

export default LoadingOverlay;