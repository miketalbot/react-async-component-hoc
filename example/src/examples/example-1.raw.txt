import React from 'react'
import {createAsyncComponent} from 'react-async-component-hoc'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import {FaThermometerFull, GiWaterDrop} from 'react-icons/all'
import {makeStyles} from '@material-ui/core/styles'

const API_KEY = '79ba901022c6291b872ce2dba7955595'

const useStyles = makeStyles(theme=>{
    return {
        icon: {
            backgroundColor: theme.palette.primary.main
        }
    }
})

export const ExampleComponent1 = createAsyncComponent(function Weather({
    lat,
    lon
}) {
    const classes = useStyles()
    return async ()=> {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
        const data = await response.json()
        return <List>
            <ListItem>
                <ListItemText primary={data.current.weather[0].main} secondary={data.timezone}/>
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                    <Avatar className={classes.icon}>
                        <FaThermometerFull/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${data.current.temp} C`} secondary={"Temperature"}/>
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                    <Avatar className={classes.icon}>
                        <GiWaterDrop/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${data.current.humidity}%`} secondary={"Humidity"}/>
            </ListItem>
        </List>
    }
})
