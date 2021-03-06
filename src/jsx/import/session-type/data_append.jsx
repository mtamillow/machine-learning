/**
 * data_append.jsx: append 'data_append' fieldset.
 *
 * @DataAppend, must be capitalized in order for reactjs to render it as a
 *     component. Otherwise, the variable is rendered as a dom node.
 * @sessionId, pass a callback to be run, within the corresponding ajax
 *     script. This allows the server side to return a list of all stored
 *     session id's, and append them to the form, respectively.
 *
 * Note: this script implements jsx (reactjs) syntax.
 */

import SupplyDatasetFile from '../input-data/supply_dataset_file.jsx';
import SupplyDatasetUrl from '../input-data/supply_dataset_url.jsx';
import checkValidString from './../validator/valid_string.js';
import checkValidInt from './../validator/valid_int.js';
import ModelType from './../model/model_type.jsx';
import Spinner from './../general/spinner.jsx';

var DataAppend = React.createClass({
  // initial 'state properties'
    getInitialState: function() {
        return {
            value_session_id: '--Select--',
            value_dataset_type: '--Select--',
            value_model_type: '--Select--',
            render_submit: false,
            ajax_done_options: null,
            ajax_done_error: null,
            ajax_fail_error: null,
            ajax_fail_status: null
        };
    },
  // update 'state properties'
    changeSessionId: function(event){
        var sessionId = event.target.value;

        if (
            sessionId && sessionId != '--Select--' &&
            checkValidInt(sessionId)
        ) {
            this.setState({value_session_id: event.target.value});
        }
        else {
            this.setState({value_session_id: '--Select--'});
            this.props.onChange({render_submit: false});
        }
    },
    changeDatasetType: function(event){
        var datasetType = event.target.value;

        if (
            datasetType && datasetType != '--Select--' &&
            checkValidString(datasetType)
        ) {
            this.setState({value_dataset_type: event.target.value});
            this.props.onChange({render_submit: false});
        }
        else {
            this.setState({value_dataset_type: '--Select--'});
            this.props.onChange({render_submit: false});
        }
    },
  // update 'state properties' from child component (i.e. 'value_model_type')
    changeModelType: function(event) {
        var modelType = event.value_model_type;

        if (
            modelType && modelType != '--Select--' &&
            checkValidString(modelType)
        ) {
            this.setState({value_model_type: modelType});
            this.props.onChange({render_submit: false});
        }
        else {
            this.setState({value_model_type: '--Select--'});
            this.props.onChange({render_submit: false});
        }
    },
  // update 'state properties' from child component
    displaySubmit: function(event) {
        if (event.submitted_proper_dataset) {
            this.props.onChange({
                render_submit: event.submitted_proper_dataset
            });
        }
        else {
            this.props.onChange({render_submit: false});
        }
    },
  // triggered when 'state properties' change
    render: function(sessionId){
        var inputDatasetType = this.state.value_dataset_type;
        var inputSessionId = this.state.value_session_id;
        var modelType = this.state.value_model_type;
        var Dataset = this.getSupplyDataset(
            inputDatasetType,
            inputSessionId,
            modelType
        );
        var options = this.state.ajax_done_options;

        if (this.state.display_spinner) {
            var AjaxSpinner = Spinner;
        }
        else {
            var AjaxSpinner = 'span';
        }

        return(
            <fieldset className='fieldset-session-data-upload'>
                <legend>Data Upload</legend>
                <fieldset className='fieldset-dataset-type'>
                    <legend>Configurations</legend>
                    <p>Select past session, and upload type</p>
                    <select
                        name='session_id'
                        autoComplete='off'
                        onChange={this.changeSessionId}
                        value={this.state.value_session_id}
                    >

                        <option value='' defaultValue>--Select--</option>

                        {/* array components require unique 'key' value */}
                        {options && options.map(function(value) {
                            return <option key={value.id} value={value.id}>
                                       {value.id}: {value.title}
                                   </option>;
                        })}

                    </select>

                    <select
                        name='dataset_type'
                        autoComplete='off'
                        onChange={this.changeDatasetType}
                        value={this.state.value_dataset_type}
                    >

                        <option value='' defaultValue>--Select--</option>
                        <option value='file_upload'>Upload file</option>
                        <option value='dataset_url'>Dataset URL</option>

                    </select>

                    <ModelType onChange={this.changeModelType} />
                </fieldset>

                <Dataset onChange={this.displaySubmit}/>

                <AjaxSpinner />
            </fieldset>
        );
    },
  // call back: used for the above 'render' (return 'span' if undefined)
    getSupplyDataset: function(datasetType, sessionId, modelType) {
        if (
            datasetType && checkValidString(datasetType) &&
            datasetType != '--Select--' && sessionId &&
            checkValidInt(sessionId) && modelType &&
            checkValidString(modelType) && modelType != '--Select--'
        ) {
            return {
                file_upload: SupplyDatasetFile,
                dataset_url: SupplyDatasetUrl
            }[datasetType] || 'span';
        }
        else {
            return 'span';
        }
    },
  // call back: get session id(s) from server side, and append to form
    componentDidMount: function () {
      // variables
        this.mounted = true;

      // ajax arguments
        var ajaxEndpoint = '/retrieve-session/';
        var ajaxArguments = {
            'endpoint': ajaxEndpoint,
            'data': null
        };

      // boolean to show ajax spinner
        this.setState({display_spinner: true});

      // asynchronous callback: ajax 'done' promise
        if (this.mounted) {
            ajaxCaller(function (asynchObject) {
              // Append to DOM
                if (asynchObject && asynchObject.error) {
                    this.setState({ajax_done_error: asynchObject.error});
                } else if (asynchObject) {
                    this.setState({ajax_done_options: asynchObject});
                }
            // boolean to hide ajax spinner
                this.setState({display_spinner: false});
            }.bind(this),
          // asynchronous callback: ajax 'fail' promise
            function (asynchStatus, asynchError) {
                if (asynchStatus) {
                    this.setState({ajax_fail_status: asynchStatus});
                    console.log('Error Status: ' + asynchStatus);
                }
                if (asynchError) {
                    this.setState({ajax_fail_error: asynchError});
                    console.log('Error Thrown: ' + asynchError);
                }
            // boolean to hide ajax spinner
                this.setState({display_spinner: false});
            }.bind(this),
          // pass ajax arguments
            ajaxArguments);
        }
    },
    componentWillUnmount() {
        this.mounted = false;
    }
});

// indicate which class can be exported, and instantiated via 'require'
export default DataAppend
