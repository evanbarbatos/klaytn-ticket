import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../Text";
import { ArrowBackIcon, ArrowForwardIcon } from "../Svg";

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`;

interface PaginationButtonProps {
  currentPage: number;
  maxPage?: number;
  showMaxPageText?: boolean;
  setCurrentPage: (value: number) => void;
}

const PaginationButton = ({ currentPage, maxPage, showMaxPageText, setCurrentPage }: PaginationButtonProps) => {
  const { t } = useTranslation();

  const handlePrevButton = () => {
    setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1);
  };

  const handleNextButton = () => {
    if (currentPage !== maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <PageButtons>
      <Arrow onClick={handlePrevButton}>
        <Text style={{ color: currentPage === 1 ? "#BDC2C4" : "#f37021" }}>Prev</Text>
      </Arrow>
      {showMaxPageText && maxPage ? (
        <Text>
          {t("Page %page% of %maxPage%", {
            page: currentPage,
            maxPage,
          })}
        </Text>
      ) : (
        <Text>{t("Page %page%", { page: currentPage })}</Text>
      )}
      <Arrow onClick={handleNextButton}>
        <Text style={{ color: currentPage === maxPage ? "#BDC2C4" : "#f37021" }}>Next</Text>
      </Arrow>
    </PageButtons>
  );
};

export default PaginationButton;
