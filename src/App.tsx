import React, { FunctionComponent, useState }  from 'react';
import { AppBar, Container, TextField, Toolbar, Typography, Paper, Box, Grid, Button, Link , Table, TableContainer, TableHead, TableRow, TableCell, Card, CardHeader, CardContent, TableBody, ButtonGroup, LinearProgress, createMuiTheme} from '@material-ui/core';

const apiUrl : string = "https://olbgmke76vfizf5twmrsz3mjxy.appsync-api.us-west-2.amazonaws.com/graphql";

const defaultApiKey : string = "da2-dtp7vdms6zb2vdkbkprzg3igf4";

const schemaStringValue : string = `type CategorizedLegislation {
  congress: Int!
  session: Int!
  vote_number: String!
  category: String!
}

enum Faction {
  HUMAN
  REPTILE
  ALIEN
  PLEIADEAN
}

type Leaked {
  congress: Int!
  senators: [LeakedSenator!]!
}

type LeakedSenator {
  lis_member_id: String!
  faction: Faction!
}

type Legislation {
  congress: Int!
  session: Int!
  vote_number: String!
  title: String!
}

type Prediction {
  congress: Int!
  lis_member_id: String!
  faction: Faction!
}

type Query {
  senator(lis_member_id: String!): Senator!
  list_senators: [Senator!]!
  legislation(congress: Int!, session: Int!, vote_number: String!): Legislation!
  list_legislation(congress: Int, session: Int): [CategorizedLegislation!]!
  list_leaked_shadow_government: [Leaked!]!
  list_predictions(congress: Int, lis_member_id: String, faction: Faction): [Prediction!]!
}

type Senator {
  lis_member_id: String!
  first_name: String!
  last_name: String!
  congresses_involved: [Int!]!
}

type ShadowGovernment {
  list_leaked: [Leaked!]!
}

schema {
  query: Query
}`;

const namedQueryTuples: [string, string][] = [
  ["Default Placeholder Query", `query MyQuery {
    __typename ## Placeholder value
  }`],
  ["List Leaked Data", `query MyQuery {
    list_leaked_shadow_government {
      senators {
        faction
        lis_member_id
      }
    }
  }`],
  ["List Predicted Aliens Query", `query MyQuery {
    list_predictions(faction: ALIEN) {
      congress
      lis_member_id
      faction
    }
  }`],
  ["List Senators Query", `query MyQuery {
    list_senators {
      lis_member_id
      first_name
      last_name
      congresses_involved
    }
  }`],
  ["List Categorized 116th Congress Legislation", `query MyQuery {
    list_legislation(congress: 116) {
      congress
      session
      vote_number
      category
    }
  }`],
  ["Show Senator S010 Details and List Predicted Factions (Composite Query, Way Cool!)", `query MyQuery {
    senator(lis_member_id: "S010") {
      last_name
      first_name
    }
    list_predictions(lis_member_id: "S010") {
      congress
      faction
    }
  }
  `],
];

const App:FunctionComponent<{}> = ({}) => {
  const [apiKey, setApiKey] = useState('');
  const [userQuery, setUserQuery] = useState(namedQueryTuples[0][1]);
  const [apiResponse, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorHint, setErrorHint] = useState('');

  const executeQuery = (query: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorHint('');
    fetch(apiUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/graphql',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({'query': query}),
    })
    .then(response => {
      setIsLoading(false);
      if (response.status == 401) {
        setErrorHint('Did you remember to reset the API Key?')
      }
      return response.json()
    })
    .then(jsonData => {
      if ('data' in jsonData) {
        setResponse(JSON.stringify(jsonData['data'], null, 2));
      } else {
        setIsError(true);
        
        setResponse(JSON.stringify(jsonData, null, 2));
      }
    })
    .catch((error) => {
      setIsError(true);
      try {
        console.log(error);
        const jsonErrorObject = JSON.parse(error);
        setResponse(JSON.stringify(jsonErrorObject, null, 2));
      } catch (e) {
        setResponse(error);
      }
    });
  };

  const loadingElement = isLoading ? (<LinearProgress variant='indeterminate' />) : (<div></div>);

  const queryExampleButtons = namedQueryTuples.map((tuple: [string, string]) => {
    const label = tuple[0];
    const query = tuple[1];
    return (
      <Button onClick={() => setUserQuery(query)}>{label}</Button>
    )
  })

  const boxMargin = 0.75;
  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Grid container justify='space-between'>
            <Grid item>
              <Typography variant='h4'>Wake Up Sheeple! 🐑</Typography>
            </Grid>
            <Grid item>
              <Typography variant='h5'>🦉 Paul Baker's WGU Capstone Project</Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container maxWidth='lg'>
        <Box m={3} p={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box m={boxMargin}>
                They walk amongst us. They want to rule us. The lizard-people are in the US Government and they want a New World Order. 🦎
              </Box>
              <Box m={boxMargin} p={3}>
                <Typography variant='caption'>
                  NOTE: This page and all it's related data are for Humans only. By interacting with this page and its related APIs you agree that you are Human. Non-humans must close the page, because they are bound and compeled to do so.
                </Typography>
              </Box>
              <Box m={boxMargin}>
                <Link href='https://web.archive.org/web/20021010174545/http://www.thewatcherfiles.com/exposing_reptilians.htm' target='_blank'>In 2002</Link>, <Link href='http://www.thewatcherfiles.com/exposing_reptilians.htm' target='_blank'>a brave and very credible website</Link> leaked a list of known agents in the 107th congress. We can use this list and couple it with machine learning techniques to determine based on voting patterns who is and isn't a malicious actor. The known factions (our target classification for any given senator) are <code>REPTILE</code>, <code>ALIEN</code>, <code>PLEIADEAN</code>, and <code>HUMAN</code>.
              </Box>
              <Box m={boxMargin}>
                At a high level, the algorithm is as follows:
                <ol>
                  <li>Aggregate legislation from all congresses and classify it</li>
                  <ul>
                    <li>This requires visiting <Link href='https://www.senate.gov' target='_blank'>senate.gov</Link> for a catalog of legislation, and then visiting <Link href='https://www.congress.gov' target='_blank'>congress.gov</Link> for the actual text contents of legislation</li>
                    <li>We take a random 20% selection of this data and use it to build our categorization k-means classifier. We don't use only legislation from the 107th congress, because that will not give us a broad enough classifier for all legislation that happens in the other congress sessions.</li>
                  </ul>
                </ol>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Classification Step</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>tfidf_vectorizer</TableCell>
                        <TableCell>We take the words, and eliminate words that appear in at least 15% of the documents but not more than 80% of the documents. This allows us to get relevant words that are general enough to appear in the majority of documents while also eliminating those that are too common (eg: "the", "congress", "US Government", etc) and eliminate those that appear very frequently in too-specific subsets of legislation (for instance, if a single document uses the word "Ballet" more frequently than any other word, we wouldn't want to consider this a category because it is too specific and should be considered an outlier. We wouldn't be able to create a category for any other legislation with this word.).</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>truncated_svd</TableCell>
                        <TableCell>This takes our vectorized bag-of-words and turns it into a function that scikit-learn can use efficiently</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>normalizer</TableCell>
                        <TableCell>This, very literally, normalizes the function. This allows us to work efficiently with various ranges of data. This is especially important <i>after</i> training has taken place during classification.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>kmeans_clustering</TableCell>
                        <TableCell>We can now actually take the normalized/vectorized/bag-of-words that we have built up and use this to create our clustered that we use to categorize future data.</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <ol start={2}>
                  <li>We create our training data from the 107th congress, which we have known leaked factions with their corresponding senators.</li>
                  <ul>
                    <li>Each senator may vote: yay, nay, or abstain (usually they are absent in this instance) which we can correlate to +1, -1, and 0 respectively. Thus if a senator votes for two pieces of legislation (both with the same category) the score for that category is +2.</li>
                  </ul>
                  <li>With the training data, we create a neural net (using MLPClassifier as our implementation) and learn for what given category, a given faction will vote</li>
                  <ul>
                    <li>Thus, we learn if the Reptilians typically vote for or against a category, we can take an uncategorized senator and determine based on their votes if they are of a given faction</li>
                  </ul>
                  <li>For each congress (EG: 101, 102, 103 and so on through 116), discluding our source of truth (congress 107) we can take the categorized legislation and for every given senator, sum their votes for a that category.</li>
                  <li>
                    Finally, we must coalese this information. During this process we store it in a number of places
                    <ul>
                      <li><Link href='https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html' target='_blank'>Amazon DynamoDB</Link></li>
                      <li><Link href='https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html'>Amazon S3</Link></li>
                      <li><Link href='https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html' target='_blank'>Amazon RDS - Aurora Serverless</Link></li>
                    </ul>
                    all of which help support a sporradic and unpredictable work-load. This unfortunately makes querying this information diffcult via normal REST style API architectures. Fortunately, GraphQL was created to solve this problem of discrete data needing to be queried by a singular (yet evolving) client. For this we use <Link href='https://docs.aws.amazon.com/appsync/latest/devguide/welcome.html' target='_blank'>Amazon AppSync</Link> which allows the end user to query the data in almost totally arbitrary manors and get exactly what they need (no more and no less).
                  </li>
                </ol>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" elevation={0}>
                <AppBar position="static">
                  <Toolbar>
                    <Typography variant='h4'>SheepleQl API</Typography>
                  </Toolbar>
                </AppBar>
                <Box m={2} p={0.5}>
                  <Grid container 
                    alignItems="center"
                    justify="space-evenly"
                    spacing={3}
                  >
                    <Grid item xs={12}>
                      <Typography variant='h3'>Terms and Conditions</Typography>
                      Non-Humans are not allowed to interact with (either directly or with proxy) to any data or APIs on this page. The API is free to use for non-comericial individual use only. Otherwise (if comercial or non-individual) an API key must be perchased.
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label='API URL' variant='outlined' defaultValue={apiUrl} disabled={true} fullWidth={true} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label='API Key' variant='outlined' value={apiKey} fullWidth={true} onChange={(event) => {setApiKey(event.target.value)}} />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                          fullWidth={true}
                          color='primary'
                          variant='contained'
                          onClick={() => setApiKey(defaultApiKey)}>Free Individual Non Compercial Use API Key (Humans only!)</Button>
                    </Grid>
                    <Grid item xl={4}>
                      <Card>
                        <CardHeader title='GraphQL Schema'/>
                        <CardContent>
                        <TextField
                          multiline
                          rows={25}
                          defaultValue={schemaStringValue}
                          variant='filled'
                          disabled={true}
                          fullWidth={true}
                        />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xl={4}>
                      <Card>
                        <CardHeader title='Your Query Here'/>
                        <CardContent>
                          <TextField
                            multiline
                            rows={25}
                            value={userQuery}
                            onChange={(event) => {setUserQuery(event.target.value)}}
                            variant='outlined'
                            fullWidth={true}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xl={4}>
                      <Card>
                        <CardHeader title='Example Queries'/>
                        <CardContent>
                          <Box m={2}>
                            <ButtonGroup
                              fullWidth={true}
                              orientation='vertical'
                              color='primary'
                              aria-label='vertical contained primary button group'
                              variant='contained'
                            >
                              {queryExampleButtons}
                            </ButtonGroup>
                          </Box>

                          <Button
                            fullWidth={true}
                            color='secondary'
                            variant='contained'
                            onClick={() => {executeQuery(userQuery)}}>
                              Execute Query<br/>(Definitely Humans Only!)
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card>
                        <CardHeader title='Response' />
                        <CardContent>
                          {loadingElement}
                          <TextField
                            label={isError ? 'Oh no! ' + errorHint: ''}
                            error={isError}
                            fullWidth={true}
                            multiline
                            rows={25}
                            variant='outlined'
                            value={apiResponse}
                          />
                          {loadingElement}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default App;
