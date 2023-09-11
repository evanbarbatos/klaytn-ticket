import styled from "styled-components";
import { space } from "styled-system";
import { RadioProps, scales } from "./types";

const getScale = ({ scale }: RadioProps) => {
  switch (scale) {
    case scales.SM:
      return "24px";
    case scales.MD:
    default:
      return "32px";
  }
};

const getCheckedScale = ({ scale }: RadioProps) => {
  switch (scale) {
    case scales.SM:
      return "12px";
    case scales.MD:
    default:
      return "20px";
  }
};

const Radio = styled.input.attrs({ type: "radio" })<RadioProps>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid #dfdfdf;

  &:after {
    border-radius: 50%;
    content: "";
    height: ${getCheckedScale};
    left: 5px;
    position: absolute;
    top: 5px;
    width: ${getCheckedScale};
  }

  &:focus {
    outline: none;
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.success};
    &:after {
      background-color: ${({ theme }) => theme.radio.handleBackground};
    }
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  ${space}
`;

Radio.defaultProps = {
  scale: scales.MD,
  m: 0,
};

export default Radio;
