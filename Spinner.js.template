import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * 로딩바 컴포넌트
 * --> 이전 단원의 실습 파일을 재사용 하세요.
 */
// --> https://mhnpd.github.io/react-loader-spinner/
import { Blocks } from 'react-loader-spinner';

const Spinner = memo(({loading=true, width=100, height=100}) => {
    return (
        <Blocks
                visible={loading}
                width={width}
                height={height}
                ariaLabel="blocks-loading"
                wrapperStyle={{
                    position: 'fixed',
                    zIndex: 9999,
                    left: '50%',
                    top: '50%',
                    trasform: 'translate(-50%, -50%)'
                }}
                wrapperClass="blocks-wrapper"
                />
    );
});

/** 데이터 타입 설정 */
Spinner.propTypes = {
    loading: PropTypes.bool.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};

export default Spinner;