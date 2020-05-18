import React from 'react'
import {createAsyncComponent, Slot} from 'react-async-component-hoc'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import {makeStyles} from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import {FaThermometerFull, GiWaterDrop} from 'react-icons/all'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Skeleton from '@material-ui/lab/Skeleton'

const WEATHER_API_KEY = '79ba901022c6291b872ce2dba7955595'
const GOOGLE_KEY = 'AIzaSyA1FojG9QXGGhsDC0lyAqt48A7csv7XO3s'

const useStyles = makeStyles((theme) => {
    return {
        icon: {
            backgroundColor: theme.palette.primary.main
        }
    }
})

export const ExampleComponent4 = createAsyncComponent(
    function Template({ $parts }) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Card variant={"outlined"}>
                        <CardHeader title={'Weather'} subheader={"Will be rendered as soon as possible, before the location search"}/>
                        <CardContent>
                            <Slot fill={$parts.weather} height={150}/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant={"outlined"}>
                        <CardHeader title={'Where shall we go?'} subheader={"Searches for restaurants if the temperature is < 16C, otherwise parks"}/>
                        <CardContent>
                            <Slot fill={$parts.location} Skeleton={Skeleton} animation="wave" variant="rect" height={600}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    },
    function MyComponent({ resolve, lat, lon }) {
        const classes = useStyles()
        return async () => {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
            )
            const data = await response.json()
            resolve(
                'weather',
                <List>

                    <ListItem>
                        <ListItemText
                            primary={data.current.weather[0].main}
                            secondary={data.timezone}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar className={classes.icon}>
                                <FaThermometerFull />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${data.current.temp} C`}
                            secondary={'Temperature'}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar className={classes.icon}>
                                <GiWaterDrop />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${data.current.humidity}%`}
                            secondary={'Humidity'}
                        />
                    </ListItem>
                </List>
            )
            const searchFor = data.current.temp < 16 ? 'restaurant' : 'park'
            const googleResponse = await fetch(
                `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_KEY}&location=${lat},${lon}&radius=60000&type=${searchFor}`,
                {method: 'get', headers: {'Accept': 'application/json', 'Access-Control-Allow-Origin': '*'}}
            )
            await new Promise(resolve=>setTimeout(resolve, 2000))
            const places = await googleResponse.json()
            resolve(
                'location',

                <List>
                    <ListSubheader>Searching for {searchFor}s</ListSubheader>
                    {places.results.map((candidate, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={candidate.name}
                                    secondary={candidate.vicinity}
                                />
                            </ListItem>
                        )
                    })}
                </List>
            )
        }
    }
)
