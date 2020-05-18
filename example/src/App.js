import React from 'react'

import 'react-async-component-hoc/dist/index.css'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { ExampleComponent1 } from './examples/example-1'
import { ExampleComponent2 } from './examples/example-2'
import { ExampleComponent3 } from './examples/example-3'
import { ExampleComponent4 } from './examples/example-4'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import CardActions from '@material-ui/core/CardActions'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import {MdKeyboardArrowDown} from 'react-icons/all'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
/* eslint import/no-webpack-loader-syntax: off */
import code1 from './examples/example-1.raw.txt'

const App = () => {
    return (
        <>
            <CssBaseline />
            <AppBar>
                <Toolbar>
                    <Typography variant={"h6"}>
                        react-async-component-hoc
                    </Typography>
                    <Box ml={3}>Examples</Box>
                </Toolbar>

            </AppBar>
            <Box mt={10}>
                <Container>
                    <Card>
                        <CardHeader
                            title={'Weather'}
                            subheader={'Simple Api Call'}
                        />
                        <CardContent>
                            <ExampleComponent1 lat={-34.397} lon={150.644} />
                        </CardContent>
                        <CardActions>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<MdKeyboardArrowDown/>}>
                                    Code
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <SyntaxHighlighter language={"jsx"}>
                                        {code1}
                                    </SyntaxHighlighter>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </CardActions>
                    </Card>
                    <Box mt={2}>
                        <Card>
                            <CardHeader
                                title={'Progress'}
                                subheader={'Repeated render / progress example'}
                            />
                            <CardContent>
                                <ExampleComponent2 />
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card>
                            <CardHeader
                                title={'Out of sequence'}
                                subheader={'Multipart render using the built in template'}
                            />
                            <CardContent>
                                <ExampleComponent3 />
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={2}>
                        <Card>
                            <CardHeader
                                title={'Render partial results'}
                                subheader={
                                    'Renders some of the results as soon as possible inside a programmer supplied template'
                                }
                            />
                            <CardContent>
                                <ExampleComponent4
                                    lat={-34.397}
                                    lon={150.644}
                                />
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default App
