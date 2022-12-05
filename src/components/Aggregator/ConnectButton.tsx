import { ConnectButton } from '@rainbow-me/rainbowkit';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: absolute;
	right: 16px;
`;

const Connect = () => {
	return (
		<Wrapper>
			<ConnectButton chainStatus={'none'} />
		</Wrapper>
	);
};

export default Connect;
