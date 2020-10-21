import * as React from 'react';

export default ({render}: any) => {
    const [value, setValue] = React.useState();

    return (
        <>
            {render(value, setValue)}
        </>
    )

}
