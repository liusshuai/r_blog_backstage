import React from 'react';
import PropTypes from 'prop-types';

export default function (loading) { //传过来一个函数    
    class LazyCom extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                Com: null
            };

            this.load();
        };

        load(props) {
            loading().then((Com) => { //调用函数获取它传过来的路径                
                this.setState({
                    Com: Com.default ? Com.default : null
                });
            });
        };

        render() {
            let Com = this.state.Com;
            return Com ? < Com router = {
                this.context.router.history
            }
            /> : null;        
        };
    };

    LazyCom.contextTypes = {
        router: PropTypes.object.isRequired
    }

    return LazyCom;
}